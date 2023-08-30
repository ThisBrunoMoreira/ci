import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '../../../../global-config';
import { DatabaseModule } from '../../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../../shared/infrastructure/database/setup/prisma-test';
import { EnvConfigModule } from '../../../../shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repository/user.repository';
import { UserDataBuilder } from '../../../domain/testing/helpers/user-data-builder';
import { UserController } from '../../user.controller';
import { UserModule } from '../../user.module';

describe('User Retrieval Endpoint', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  const prismaService = new PrismaClient();
  let entities: UserEntity[];

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
  });

  describe('GET /user/:id', () => {
    beforeEach(async () => {
      const createdAt = new Date();
      entities = Array(3)
        .fill(UserDataBuilder({}))
        .map((element, index) => {
          return new UserEntity({
            ...element,
            email: `a${index}@a.com`,
            createdAt: new Date(createdAt.getTime() + index),
          });
        });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });
    });

    it('should retrieve users successfully', async () => {
      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/user/${queryParams}`)
        .expect(HttpStatus.OK);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map((item) => instanceToPlain(UserController.userToResponse(item))),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 15,
          lastPage: 1,
        },
      });
    });

    it('should return 404 when user is not found', async () => {
      const res = await request(app.getHttpServer())
        .get(`/user/?fakeid=10`)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['property fakeid should not exist']);
    });
  });
});
