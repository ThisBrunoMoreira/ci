import { PrismaClient, User } from '@prisma/client';
import { ClassValidatorFields } from '../../../../../shared/domain/erros/validation-erro';
import { setupPrismaTest } from '../../../../../shared/infrastructure/database/setup/prisma-test';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserModelMapper } from './user-model.mapper';

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTest();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      name: 'Test name',
      email: 'a@a.com',
      password: 'TestPassword123',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throws error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null });
    expect(() => UserModelMapper.toEntity(model)).toThrowError(
      ClassValidatorFields,
    );
  });

  it('should convert a user model to a user entity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    });
    const sut = UserModelMapper.toEntity(model);
    expect(sut).toBeInstanceOf(UserEntity);
  });
});
