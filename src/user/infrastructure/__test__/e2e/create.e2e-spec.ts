import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
import request from 'supertest';

import { applyGlobalConfig } from '../../../../global-config';
import { DatabaseModule } from '../../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../../shared/infrastructure/database/setup/prisma-test';
import { EnvConfigModule } from '../../../../shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UserDataBuilder } from '../../../domain/testing/helpers/user-data-builder';
import { SignupDto } from '../../dto/signup.dto';
import { UserController } from '../../user.controller';
import { UserModule } from '../../user.module';

describe('UserController e2e test', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let signupDto: SignupDto;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTest();

    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UserModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    repository = module.get<UserRepository.Repository>('UserRepository');
  });

  beforeEach(async () => {
    signupDto = {
      name: 'any_name',
      email: 'any@any.com',
      password: 'any_password',
    };

    await prismaService.user.deleteMany();
  });

  describe('POST /user', () => {
    it('should create a user successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(signupDto)
        .expect(201);

      expect(Object.keys(res.body)).toStrictEqual(['data']);

      const user = await repository.findOne(res.body.data.id);
      const presenter = UserController.userToResponse(user.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toStrictEqual(serialized);
    });
    it('should return 422 when sending invalid data', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'password should not be empty',
        'password must be a string',
      ]);
    });
    it('should return 422 when name is missing', async () => {
      delete signupDto.name;
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(signupDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });
    it('should return 422 when password is missing', async () => {
      delete signupDto.password;
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(signupDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ]);
    });
    it('should return 422 when email is missing', async () => {
      delete signupDto.email;
      const res = await request(app.getHttpServer())
        .post('/user')
        .send(signupDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'email must be an email',
        'email should not be empty',
        'email must be a string',
      ]);
    });
    it('should return 409 when email is already in use', async () => {
      const entity = new UserEntity(UserDataBuilder({ ...signupDto }));
      await repository.create(entity);

      const res = await request(app.getHttpServer())
        .post('/user')
        .send(signupDto)
        .expect(409)
        .expect({
          statusCode: 409,
          error: 'Conflict',
          message: 'Email Address already any@any.com',
        });
    });
  });
});
