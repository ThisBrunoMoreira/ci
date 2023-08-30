import { faker } from '@faker-js/faker';
import { validate as uuidValidate } from 'uuid';
import { Entity } from './entity';

type StubProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit test', () => {
  describe('Constructor method', () => {
    it('should create an entity with a random id if id is not provided', () => {
      const props = { prop1: 'anyValue', prop2: faker.number.int() };
      const entity = new StubEntity(props);

      expect(entity.props).toStrictEqual(props);
      expect(entity._id).not.toBeNull();
      expect(uuidValidate(entity._id)).toBeTruthy();
    });

    it('should create an entity with the provided id', () => {
      const props = { prop1: 'anyValue', prop2: faker.number.int() };
      const id = '6a743611-e447-4004-8483-7f0a1d5c0055';
      const entity = new StubEntity(props, id);

      expect(entity._id).toBe(id);
      expect(uuidValidate(entity._id)).toBeTruthy();
    });
  });

  describe('toJSON', () => {
    it('should convert an entity to a JavaScript Object', () => {
      const props = { prop1: 'anyValue', prop2: faker.number.int() };
      const id = '6a743611-e447-4004-8483-7f0a1d5c0055';
      const entity = new StubEntity(props, id);
      const result = entity.toJSON();

      expect(result).toStrictEqual({
        id,
        ...props,
      });
    });
  });
});
