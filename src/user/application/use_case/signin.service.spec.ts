import { HashingService } from '../../../shared/application/provider/hash-provider';
import { NotFoundError } from '../../../shared/domain/erros/not-found-error';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '../../infrastructure/database/in-memory/repository/user-in-memory.repository';
import { BcryptPasswordHasher } from '../../provider/hash-provider/bcryptjs-hash-provider';
import { BadRequestError } from '../error/bad-request-error';
import { InvalidCredentialsError } from '../error/invalid-credentials-error';
import { SignInService } from './signin.service';

describe('SigninUseCase unit tests', () => {
  let sut: SignInService.SignIn;
  let repository: UserInMemoryRepository;
  let hashProvider: HashingService;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptPasswordHasher();
    sut = new SignInService.SignIn(repository, hashProvider);
  });

  it('Should authenticate a user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const hashPassword = await hashProvider.generateHash('any_password');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'any@gmail.com', password: hashPassword }),
    );
    repository.items = [entity];

    const result = await sut.executeSignIn({
      email: entity.email,
      password: 'any_password',
    });
    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(entity.toJSON());
  });

  it('Should throws error when email not provided', async () => {
    await expect(() =>
      sut.executeSignIn({ email: null, password: 'any_password' }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('Should throws error when password not provided', async () => {
    await expect(() =>
      sut.executeSignIn({ email: 'any@gmail.com', password: null }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('Should not be able authenticate with wrong email', async () => {
    await expect(() =>
      sut.executeSignIn({ email: 'any@gmail.com', password: 'any_password' }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('Should not be able authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('any_password');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'any@gmail.com', password: hashPassword }),
    );
    repository.items = [entity];

    await expect(() =>
      sut.executeSignIn({ email: 'any@gmail.com', password: 'fake' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
