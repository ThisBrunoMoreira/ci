import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { HashingService } from '../../../shared/application/provider/hash-provider';
import { DatabaseModule } from '../../../shared/infrastructure/database/database.module';
import { setupPrismaTest } from '../../../shared/infrastructure/database/setup/prisma-test';
import { UserPrismaRepository } from '../../infrastructure/database/prisma/repository/user-prisma.repository';
import { BcryptPasswordHasher } from '../../provider/hash-provider/bcryptjs-hash-provider';
import { SignupService } from './signup.service';

describe('SignupService integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SignupService.Create;
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
    sut = new SignupService.Create(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a user', async () => {
    const props = {
      name: 'test name',
      email: 'a@a.com',
      password: 'TestPassword123',
    };
    const output = await sut.executeSignup(props);
    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
