import { HashingService } from '../../../shared/application/provider/hash-provider';
import { ConflictError } from '../../../shared/domain/erros/conflict-error';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '../../infrastructure/database/in-memory/repository/user-in-memory.repository';
import { BcryptPasswordHasher } from '../../provider/hash-provider/bcryptjs-hash-provider';
import { BadRequestError } from '../error/bad-request-error';

import { SignupService } from './signup.service';

describe('SignupUseCase unit tests', () => {
  let sut: SignupService.Create;
  let repository: UserInMemoryRepository;
  let hashProvider: HashingService;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptPasswordHasher();
    sut = new SignupService.Create(repository, hashProvider);
  });

  describe('Service Method', () => {
    it('should successfully create a user', async () => {
      const spyInsert = jest.spyOn(repository, 'create');
      const userProps = UserDataBuilder({});
      const createdUser = await sut.executeSignup({
        name: userProps.name,
        email: userProps.email,
        password: userProps.password,
      });

      expect(createdUser.id).toBeDefined();
      expect(createdUser.createdAt).toBeInstanceOf(Date);
      expect(spyInsert).toHaveBeenCalledTimes(1);
    });

    it('should prevent duplicate registration with the same email', async () => {
      const existingUserProps = UserDataBuilder({ email: 'a@a.com' });
      await sut.executeSignup(existingUserProps);

      await expect(() =>
        sut.executeSignup(existingUserProps),
      ).rejects.toBeInstanceOf(ConflictError);
    });

    it('should throw an error when name is not provided during registration', async () => {
      const userPropsWithoutName = { ...UserDataBuilder({}), name: null };
      await expect(() =>
        sut.executeSignup(userPropsWithoutName),
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it('should throw an error when email is missing during registration', async () => {
      const userPropsWithoutEmail = { ...UserDataBuilder({}), email: null };
      await expect(() =>
        sut.executeSignup(userPropsWithoutEmail),
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it('should throw an error when password is missing during registration', async () => {
      const userPropsWithoutPassword = {
        ...UserDataBuilder({}),
        password: null,
      };
      await expect(() =>
        sut.executeSignup(userPropsWithoutPassword),
      ).rejects.toBeInstanceOf(BadRequestError);
    });
  });
});
