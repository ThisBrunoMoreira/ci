import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../shared/infrastructure/database/setup/prisma-test';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '../../infrastructure/database/prisma/repository/user-prisma.repository';
import { DetailUserService } from './detail-user.service';

describe('detail-user integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DetailUserService.UserProfile;
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
    sut = new DetailUserService.UserProfile(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throw an error when trying to found a non-existent user', async () => {
    await expect(
      async () => await sut.findOne({ id: 'fakeId' }),
    ).rejects.toThrow('UserModel not found using ID fakeId');
  });

  it('should find a user successfully', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    await sut.findOne({ id: entity._id });

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });

    expect(output).toMatchObject(newUser);
  });
});
