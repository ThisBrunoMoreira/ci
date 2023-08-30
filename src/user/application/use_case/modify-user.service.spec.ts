import { NotFoundError } from '../../../shared/domain/erros/not-found-error';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '../../infrastructure/database/in-memory/repository/user-in-memory.repository';
import { BadRequestError } from '../error/bad-request-error';
import { ModifyUserService } from './modify-user.service';

describe('UpdateUserUseCase unit tests', () => {
  let sut: ModifyUserService.UserProfileModification;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ModifyUserService.UserProfileModification(repository);
  });

  it('Should throw an error when entity not found', async () => {
    await expect(
      async () => await sut.update({ id: 'fakeId', name: 'test name' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throw an error when name not provided', async () => {
    await expect(
      async () => await sut.update({ id: 'fakeId', name: '' }),
    ).rejects.toThrow(new BadRequestError('Name not provided'));
  });

  it('Should update a user', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;

    const result = await sut.update({ id: items[0]._id, name: 'new name' });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'new name',
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    });
  });
});
