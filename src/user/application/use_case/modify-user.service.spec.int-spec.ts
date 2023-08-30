import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../../shared/domain/erros/not-found-error';
import { DatabaseModule } from '../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../shared/infrastructure/database/setup/prisma-test';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '../../infrastructure/database/prisma/repository/user-prisma.repository';
import { ModifyUserService } from './modify-user.service';

describe('ModifyUserService Integration Tests', () => {
  const prismaService = new PrismaClient();
  let sut: ModifyUserService.UserProfileModification;
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
    sut = new ModifyUserService.UserProfileModification(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('throws an error when the entity is not found', async () => {
    const fakeUserId = 'fakeId';
    const fakeUserName = 'fake name';

    await expect(() =>
      sut.update({ id: fakeUserId, name: fakeUserName }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${fakeUserId}`),
    );
  });

  it('updates a user successfully', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    const newUserName = 'new name';

    const output = await sut.update({ id: entity._id, name: newUserName });

    expect(output.name).toBe(newUserName);
  });
});
