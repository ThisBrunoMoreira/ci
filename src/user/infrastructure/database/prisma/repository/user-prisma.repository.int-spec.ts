import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { ConflictError } from '../../../../../shared/domain/erros/conflict-error';
import { NotFoundError } from '../../../../../shared/domain/erros/not-found-error';
import { DatabaseModule } from '../../../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../../../shared/infrastructure/database/setup/prisma-test';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserRepository } from '../../../../domain/repository/user.repository';
import { UserDataBuilder } from '../../../../domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from './user-prisma.repository';

describe('UserPrismaRepository Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTest();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  describe('findOne Method', () => {
    it('should throw an error when entity is not found', async () => {
      await expect(sut.findOne('FakeId')).rejects.toThrow(
        new NotFoundError('UserModel not found using ID FakeId'),
      );
    });

    it('should find an entity by ID', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      const newUser = await prismaService.user.create({
        data: entity.toJSON(),
      });

      const output = await sut.findOne(newUser.id);
      expect(output.toJSON()).toStrictEqual(entity.toJSON());
    });
  });

  describe('create Method', () => {
    it('should create an entity and find it by ID', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await sut.create(entity);

      const result = await prismaService.user.findUnique({
        where: {
          id: entity._id,
        },
      });

      expect(result).toStrictEqual(entity.toJSON());
    });
  });
  describe('findAll Method', () => {
    it('should returns all users', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJSON(),
      });

      const entities = await sut.findAll();
      expect(entities).toHaveLength(1);
      expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
      entities.map((item) =>
        expect(item.toJSON()).toStrictEqual(entity.toJSON()),
      );
    });
  });
  describe('search Method', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(16).fill(UserDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...element,
            name: `User${index}`,
            email: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(UserEntity);
      });
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@mail.com`).toBe(item.email);
      });
    });

    it('should search using filter, sort and paginate', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
    });
  });
  describe('update method', () => {
    it('should update a entity', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJSON(),
      });
      entity.updateUserName('new name');
      await sut.update(entity);

      const output = await prismaService.user.findUnique({
        where: {
          id: entity._id,
        },
      });
      expect(output.name).toBe('new name');
    });
  });

  describe('remove method', () => {
    it('should successfully remove an existing entity', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJSON(),
      });
      await sut.remove(entity._id);

      const output = await prismaService.user.findUnique({
        where: {
          id: entity._id,
        },
      });
      expect(output).toBeNull();
    });
  });
  describe('emailExists method', () => {
    it('should throws error when a entity found by email', async () => {
      const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
      await prismaService.user.create({
        data: entity.toJSON(),
      });

      await expect(() => sut.emailExists('a@a.com')).rejects.toThrow(
        new ConflictError(`Email Address already a@a.com`),
      );
    });

    it('should not finds a entity by email', async () => {
      expect.assertions(0);
      await sut.emailExists('a@a.com');
    });
  });
  describe('findByEmail method', () => {
    it('should throws error when a entity not found', async () => {
      await expect(() => sut.findByEmail('a@a.com')).rejects.toThrow(
        new NotFoundError(`UserModel not found using email a@a.com`),
      );
    });
    it('should finds a entity by email', async () => {
      const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
      const newUser = await prismaService.user.create({
        data: entity.toJSON(),
      });
      const output = await sut.findByEmail('a@a.com');

      expect(output.toJSON()).toStrictEqual(entity.toJSON());
    });
  });
});
