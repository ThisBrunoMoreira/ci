import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../shared/infrastructure/database/setup/prisma-test';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '../../infrastructure/database/prisma/repository/user-prisma.repository';
import { DetailUsersService } from './detail-users.service';

describe('detail-users  integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DetailUsersService.UsersProfile;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTest();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DetailUsersService.UsersProfile(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should retrieve all users successfully', async () => {
    const createdAt = new Date();
    const entities: UserEntity[] = [];
    const arrange = Array(3).fill(UserDataBuilder({}));
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
    const output = await sut.findAll({});
    expect(output).toStrictEqual({
      items: entities.reverse().map((item) => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });
  it('should search using filter, sort, and paginate', async () => {
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

    let output = await sut.findAll({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    output = await sut.findAll({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});
