import { NotFoundError } from '../../../shared/domain/erros/not-found-error';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '../../infrastructure/database/in-memory/repository/user-in-memory.repository';
import { RemoveUserService } from './remove-user.service';

describe('RemoveUserService Unit Tests', () => {
  let removeUserService: RemoveUserService.UserProfile;
  let userRepository: UserInMemoryRepository;

  beforeEach(() => {
    userRepository = new UserInMemoryRepository();
    removeUserService = new RemoveUserService.UserProfile(userRepository);
  });

  describe('remove Method', () => {
    it('should throw a NotFoundError when trying to remove a user with a non-existent ID', async () => {
      const nonExistentUserId = 'fakeId';
      await expect(() =>
        removeUserService.remove({ id: nonExistentUserId }),
      ).rejects.toThrow(new NotFoundError('Entity not found'));
    });

    it('should successfully remove a user when a valid ID is provided', async () => {
      const user = new UserEntity(UserDataBuilder({}));
      userRepository.items = [user];

      const spyRemove = jest.spyOn(userRepository, 'remove');
      await removeUserService.remove({ id: user._id });

      expect(spyRemove).toHaveBeenCalledTimes(1);
      expect(userRepository.items).toHaveLength(0);
    });
  });
});
