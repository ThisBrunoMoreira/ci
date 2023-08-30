import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseModule } from '../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../shared/infrastructure/database/setup/prisma-test';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '../../infrastructure/database/prisma/repository/user-prisma.repository';
import { RemoveUserService } from './remove-user.service';

describe('remove integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: RemoveUserService.UserProfile;
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
    sut = new RemoveUserService.UserProfile(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throw an error when trying to remove a non-existent user', async () => {
    await expect(
      async () => await sut.remove({ id: 'fakeId' }),
    ).rejects.toThrow('UserModel not found using ID fakeId');
  });

  it('should remove a user successfully', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    await sut.remove({ id: entity._id });

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });

    expect(output).toBeNull();
    const models = await prismaService.user.findMany();
    expect(models).toHaveLength(0);
  });
});
