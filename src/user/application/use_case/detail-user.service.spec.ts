import { NotFoundError } from '../../../shared/domain/erros/not-found-error';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDataBuilder } from '../../domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '../../infrastructure/database/in-memory/repository/user-in-memory.repository';
import { DetailUserService } from './detail-user.service';

describe('DetailUserService Unit Tests', () => {
  let sut: DetailUserService.UserProfile;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new DetailUserService.UserProfile(repository);
  });

  describe('findOne Method', () => {
    it('should throw an error when ID is not provided', async () => {
      await expect(() => sut.findOne({ id: 'fakeId' })).rejects.toThrow(
        new NotFoundError('Entity not found'),
      );
    });

    it('should retrieve user details when valid ID is provided', async () => {
      const spyFindById = jest.spyOn(repository, 'findOne');
      const user = new UserEntity(UserDataBuilder({}));
      repository.items = [user];

      const result = await sut.findOne({ id: user._id });

      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
      });
    });
  });
});
