import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

import { applyGlobalConfig } from '../../../../global-config';
import { DatabaseModule } from '../../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../../shared/infrastructure/database/setup/prisma-test';
import { EnvConfigModule } from '../../../../shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UserDataBuilder } from '../../../domain/testing/helpers/user-data-builder';
import { UserModule } from '../../user.module';

describe('User Delete Endpoint', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  const prismaService = new PrismaClient();
  let entity: UserEntity;

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
    await prismaService.user.deleteMany();
    entity = new UserEntity(UserDataBuilder({}));
    await repository.create(entity);
  });

  describe('DELETE /user/:id', () => {
    it('should delete a user successfully', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/user/${entity._id}`)
        .expect(HttpStatus.NO_CONTENT);

      expect(res.body).toEqual({});
    });

    it('should return 404 when user is not found', async () => {
      const fakeUserId = 'fake_id';

      const res = await request(app.getHttpServer())
        .get(`/user/${fakeUserId}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(res.body).toEqual({
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Not Found',
        message: `UserModel not found using ID ${fakeUserId}`,
      });
    });
  });
});
