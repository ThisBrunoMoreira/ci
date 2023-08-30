import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { HashingService } from '../../../shared/application/provider/hash-provider';
import { NotFoundError } from '../../../shared/domain/erros/not-found-error';
import { DatabaseModule } from '../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../shared/infrastructure/database/setup/prisma-test';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserPrismaRepository } from '../../infrastructure/database/prisma/repository/user-prisma.repository';
import { BcryptPasswordHasher } from '../../provider/hash-provider/bcryptjs-hash-provider';
import { InvalidPasswordError } from '../error/invalid-password-error';
import { PasswordModificationService } from './modify-password.service';

describe('modify password integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: PasswordModificationService.passwordModification;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProvider: HashingService;

  beforeAll(async () => {
    setupPrismaTest();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptPasswordHasher();
  });

  beforeEach(async () => {
    sut = new PasswordModificationService.passwordModification(
      repository,
      hashProvider,
    );
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });
  it('should throws error when a entity found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() =>
      sut.update({
        id: entity._id,
        oldPassword: 'OldPassword',
        password: 'NewPassword',
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    );
  });

  it('should throws error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.update({
        id: entity._id,
        oldPassword: '',
        password: 'NewPassword',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(
        'Both old password and new password are required.',
      ),
    );
  });

  it('should throws error when new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.update({
        id: entity._id,
        oldPassword: 'OldPassword',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(
        'Both old password and new password are required.',
      ),
    );
  });
  it('should update a password', async () => {
    const oldPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.update({
      id: entity._id,
      oldPassword: '1234',
      password: 'NewPassword',
    });

    const result = await hashProvider.compareHash(
      'NewPassword',
      output.password,
    );
    expect(result).toBeTruthy();
  });
});
