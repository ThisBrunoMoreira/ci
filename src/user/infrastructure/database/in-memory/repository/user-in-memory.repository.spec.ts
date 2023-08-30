import { ConflictError } from '../../../../../shared/domain/erros/conflict-error';
import { NotFoundError } from '../../../../../shared/domain/erros/not-found-error';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserDataBuilder } from '../../../../domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from './user-in-memory.repository';

describe('UserInMemoryRepository', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  describe('findByEmail', () => {
    it('should throw an error when email is not found', async () => {
      await expect(sut.findByEmail('fake-email@gmail.com')).rejects.toThrow(
        new NotFoundError('Entity not found using email fake-email@gmail.com'),
      );
    });

    it('should find a user by email', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await sut.create(entity);
      const result = await sut.findByEmail(entity.email);

      expect(entity.toJSON()).toStrictEqual(result.toJSON());
    });
  });

  describe('emailExists', () => {
    it('should throw an error when email already exists', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await sut.create(entity);
      await expect(sut.emailExists(entity.email)).rejects.toThrow(
        new ConflictError('Email address already used'),
      );
    });

    it('should not throw an error when email does not exist', async () => {
      expect.assertions(0);
      await sut.emailExists('any-email@gmail.com');
    });
  });

  describe('applyFilter', () => {
    it('should not filter items when the filter object is null', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await sut.create(entity);
      const result = await sut.findAll();
      const spyFilter = jest.spyOn(result, 'filter');
      const itemsFiltered = await sut['applyFilter'](result, null);

      expect(spyFilter).not.toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual(result);
    });

    it('should filter items by name field using the provided filter param', async () => {
      const items = [
        new UserEntity(UserDataBuilder({ name: 'Test' })),
        new UserEntity(UserDataBuilder({ name: 'TEST' })),
        new UserEntity(UserDataBuilder({ name: 'fake' })),
      ];
      const spyFilter = jest.spyOn(items, 'filter');
      const itemsFiltered = await sut['applyFilter'](items, 'TEST');

      expect(spyFilter).toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
    });
  });

  describe('applySort', () => {
    it('should sort items by createdAt when sort param is null', async () => {
      const createdAt = new Date();
      const items = [
        new UserEntity(UserDataBuilder({ name: 'Test', createdAt })),
        new UserEntity(
          UserDataBuilder({
            name: 'TEST',
            createdAt: new Date(createdAt.getTime() + 1),
          }),
        ),
        new UserEntity(
          UserDataBuilder({
            name: 'fake',
            createdAt: new Date(createdAt.getTime() + 2),
          }),
        ),
      ];
      const itemsSorted = await sut['applySort'](items, null, null);

      expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('should sort items by name field in ascending or descending order', async () => {
      const items = [
        new UserEntity(UserDataBuilder({ name: 'c' })),
        new UserEntity(
          UserDataBuilder({
            name: 'd',
          }),
        ),
        new UserEntity(
          UserDataBuilder({
            name: 'a',
          }),
        ),
      ];

      let itemsSorted = await sut['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

      itemsSorted = await sut['applySort'](items, 'name', null);
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
    });
  });
});
