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
import { BadRequestError } from '../error/bad-request-error';
import { InvalidCredentialsError } from '../error/invalid-credentials-error';
import { SignInService } from './signin.service';

describe('SignupService integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SignInService.SignIn;
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
    sut = new SignInService.SignIn(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should not be able to authenticate with wrong email', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() =>
      sut.executeSignIn({
        email: entity.email,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      UserDataBuilder({
        email: 'a@a.com',
        password: hashPassword,
      }),
    );
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.executeSignIn({
        email: 'a@a.com',
        password: 'fake',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should throws error when email not provided', async () => {
    await expect(() =>
      sut.executeSignIn({
        email: null,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should throws error when password not provided', async () => {
    await expect(() =>
      sut.executeSignIn({
        email: 'a@a.com',
        password: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.executeSignIn({
      email: 'a@a.com',
      password: '1234',
    });

    expect(output).toMatchObject(entity.toJSON());
  });
});
