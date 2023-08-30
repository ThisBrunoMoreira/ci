import { Entity } from '../../domain/entities/entity';
import { NotFoundError } from '../../domain/erros/not-found-error';
import { InMemoryRepository } from './in-memory-repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('StubInMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  describe('create method', () => {
    it('should create a new entity', async () => {
      const entity = new StubEntity({ name: 'any name', price: 50 });

      await repository.create(entity);
      const createdEntity = repository.items[0];

      expect(entity.toJSON()).toStrictEqual(createdEntity.toJSON());
    });
  });

  describe('findOne method', () => {
    it('should find existing entity by id', async () => {
      const entity = new StubEntity({ name: 'any name', price: 50 });

      await repository.create(entity);
      const foundEntity = await repository.findOne(entity.id);

      expect(entity.toJSON()).toStrictEqual(foundEntity.toJSON());
    });

    it('should throw NotFoundError when entity is not found', async () => {
      await expect(repository.findOne('fakeId')).rejects.toThrow(
        new NotFoundError('Entity not found'),
      );
    });
  });

  describe('findAll method', () => {
    it('should find all entities', async () => {
      const entity = new StubEntity({ name: 'any name', price: 50 });

      await repository.create(entity);
      const foundEntities = await repository.findAll();

      expect([entity]).toStrictEqual(foundEntities);
    });
  });

  describe('update method', () => {
    it('should update existing entity by id', async () => {
      const entity = new StubEntity({ name: 'any name', price: 50 });

      await repository.create(entity);

      const updatedEntity = new StubEntity(
        { name: 'other name', price: 50 },
        entity.id,
      );

      await repository.update(updatedEntity);

      expect(updatedEntity.toJSON()).toStrictEqual(
        repository.items[0].toJSON(),
      );
    });

    it('should throw NotFoundError when updating a non-existing entity', async () => {
      const entity = new StubEntity({ name: 'any name', price: 50 });
      await expect(repository.update(entity)).rejects.toThrow(
        new NotFoundError('Entity not found'),
      );
    });
  });

  describe('remove method', () => {
    it('should remove existing entity by id', async () => {
      const entity = new StubEntity({ name: 'any name', price: 50 });

      await repository.create(entity);
      await repository.remove(entity.id);

      expect(repository.items).toHaveLength(0);
    });

    it('should throw NotFoundError when removing a non-existing entity', async () => {
      await expect(repository.remove('fakeId')).rejects.toThrow(
        new NotFoundError('Entity not found'),
      );
    });
  });
});
