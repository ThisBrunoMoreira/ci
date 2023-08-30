import { EntityValidationError } from '../../../shared/domain/erros/validation-erro';
import { UserDataBuilder } from '../testing/helpers/user-data-builder';
import { UserEntity, UserProps } from './user.entity';

describe('UserEntity integration test', () => {
  const validUserData: UserProps = UserDataBuilder({});
  const entity = new UserEntity(validUserData);

  describe('Constructor method', () => {
    it('should successfully validate user with valid data fields', () => {
      expect.assertions(0);
      new UserEntity(validUserData);
    });

    it('should successfully validate updated user name', () => {
      expect.assertions(0);
      entity.updateUserName('any name');
    });

    it('should successfully validate updated user password', () => {
      expect.assertions(0);
      entity.updateUserPassword('any_password');
    });
  });

  describe('Invalidating Name', () => {
    it('should throw an error for null name', () => {
      const props: UserProps = { ...validUserData, name: null };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for empty name', () => {
      const props: UserProps = { ...validUserData, name: '' };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for non-string name', () => {
      const props: UserProps = { ...validUserData, name: 10 as any };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for name longer than 255 characters', () => {
      const props: UserProps = { ...validUserData, name: 'a'.repeat(256) };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
  });

  describe('Invalidating Password', () => {
    it('should throw an error for null password', () => {
      const props: UserProps = { ...validUserData, password: null };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for empty password', () => {
      const props: UserProps = { ...validUserData, password: '' };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for non-string password', () => {
      const props: UserProps = { ...validUserData, password: 10 as any };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for password longer than 255 characters', () => {
      const props: UserProps = {
        ...validUserData,
        password: 'a'.repeat(101),
      };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
  });

  describe('Invalidating Email', () => {
    it('should throw an error for null email', () => {
      const props: UserProps = { ...validUserData, email: null };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for empty email', () => {
      const props: UserProps = { ...validUserData, email: '' };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for non-string email', () => {
      const props: UserProps = { ...validUserData, email: 10 as any };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for email longer than 255 characters', () => {
      const props: UserProps = { ...validUserData, email: 'a'.repeat(256) };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for invalid email format', () => {
      const props: UserProps = { ...validUserData, email: 'invalid_email' };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
  });

  describe('Invalidating createdAt', () => {
    it('should throw an error for non-Date createdAt', () => {
      const props: UserProps = { ...validUserData, createdAt: '2023' as any };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });

    it('should throw an error for invalid createdAt', () => {
      const props: UserProps = { ...validUserData, createdAt: 10 as any };
      expect(() => new UserEntity(props)).toThrowError(EntityValidationError);
    });
  });

  describe('updateUserName Method', () => {
    it('should throw an error for null name during update', () => {
      expect(() => entity.updateUserName(null)).toThrowError(
        EntityValidationError,
      );
    });

    it('should throw an error for empty name during update', () => {
      expect(() => entity.updateUserName('')).toThrowError(
        EntityValidationError,
      );
    });

    it('should throw an error for non-string name during update', () => {
      expect(() => entity.updateUserName(10 as any)).toThrowError(
        EntityValidationError,
      );
    });

    it('should throw an error for name longer than 255 characters during update', () => {
      expect(() => entity.updateUserName('a'.repeat(256))).toThrowError(
        EntityValidationError,
      );
    });
  });

  describe('updateUserPassword Method', () => {
    it('should throw an error for null password during update', () => {
      expect(() => entity.updateUserPassword(null)).toThrowError(
        EntityValidationError,
      );
    });

    it('should throw an error for empty password during update', () => {
      expect(() => entity.updateUserPassword('')).toThrowError(
        EntityValidationError,
      );
    });

    it('should throw an error for non-string password during update', () => {
      expect(() => entity.updateUserPassword(10 as any)).toThrowError(
        EntityValidationError,
      );
    });

    it('should throw an error for password longer than 100 characters during update', () => {
      expect(() => entity.updateUserPassword('a'.repeat(101))).toThrowError(
        EntityValidationError,
      );
    });
  });
});
