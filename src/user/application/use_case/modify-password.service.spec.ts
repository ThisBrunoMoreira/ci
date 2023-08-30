import { HashingService } from '../../../shared/application/provider/hash-provider';
import { NotFoundError } from '../../../shared/domain/erros/not-found-error';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '../../infrastructure/database/in-memory/repository/user-in-memory.repository';
import { BcryptPasswordHasher } from '../../provider/hash-provider/bcryptjs-hash-provider';
import { InvalidPasswordError } from '../error/invalid-password-error';
import { PasswordModificationService } from './modify-password.service';

describe('PasswordModificationService Unit Tests', () => {
  let sut: PasswordModificationService.passwordModification;
  let repository: UserInMemoryRepository;
  let hashingService: HashingService;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashingService = new BcryptPasswordHasher();
    sut = new PasswordModificationService.passwordModification(
      repository,
      hashingService,
    );
  });

  it('should throw an error when entity not found', async () => {
    await expect(async () =>
      sut.update({
        id: 'fakeId',
        password: 'any password',
        oldPassword: 'old password',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('should throw an error when old password is not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    repository.items = [entity];
    await expect(async () =>
      sut.update({
        id: entity.id,
        password: 'any password',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(
        'Both old password and new password are required.',
      ),
    );
  });

  it('should throw an error when new password is not provided', async () => {
    const entity = new UserEntity(
      UserDataBuilder({ password: 'any password' }),
    );
    repository.items = [entity];
    await expect(async () =>
      sut.update({
        id: entity.id,
        password: '',
        oldPassword: 'any password',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(
        'Both old password and new password are required.',
      ),
    );
  });

  it('should throw an error when old password is incorrect', async () => {
    const hashingPasswordOld = await hashingService.generateHash(
      'old_password',
    );
    const entity = new UserEntity(
      UserDataBuilder({ password: hashingPasswordOld }),
    );
    repository.items = [entity];
    await expect(async () =>
      sut.update({
        id: entity.id,
        password: 'new_password',
        oldPassword: 'other_password',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Password is incorrect.'));
  });

  it('should update a password', async () => {
    const hashPassword = await hashingService.generateHash('old_password');
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))];
    repository.items = items;

    const result = await sut.update({
      id: items[0]._id,
      password: 'new_password',
      oldPassword: 'old_password',
    });

    const checkNewPassword = await hashingService.compareHash(
      'new_password',
      result.password,
    );
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(checkNewPassword).toBeTruthy();
  });
});
