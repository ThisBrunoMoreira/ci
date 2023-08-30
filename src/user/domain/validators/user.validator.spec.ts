import { UserProps } from '../entities/user.entity';
import { UserDataBuilder } from '../testing/helpers/user-data-builder';
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from './user.validator';

let sut: UserValidator;
let props: UserProps;

describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create();
    props = UserDataBuilder({});
  });

  describe('Validation of users', () => {
    it('should validate successfully for valid data fields', () => {
      const isValid = sut.validate(props);
      expect(isValid).toBeTruthy();
      expect(sut.validatedData).toStrictEqual(new UserRules(props));
    });
  });

  describe('Invalidate Name', () => {
    it('should invalidate when the name field is null', () => {
      const isValid = sut.validate({ ...props, name: null as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('should invalidate when the name field is empty', () => {
      const isValid = sut.validate({ ...props, name: '' });
      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual(['name should not be empty']);
    });

    it('should invalidate when the name field is not a string', () => {
      const isValid = sut.validate({ ...props, name: 10 as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ]);
    });

    it('should invalidate when the name field is longer than 255 characters', () => {
      const isValid = sut.validate({ ...props, name: 'a'.repeat(256) });
      expect(isValid).toBeFalsy();
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ]);
    });
  });

  describe('Invalidate email', () => {
    it('should invalidate when the email field is null', () => {
      const isValid = sut.validate({ ...props, email: null as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
        'email must be a string',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('should invalidate when the email field is empty', () => {
      const isValid = sut.validate({ ...props, email: '' });
      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ]);
    });

    it('should invalidate when the email field is not a string', () => {
      const isValid = sut.validate({ ...props, email: 123 as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be a string',
        'email must be shorter than or equal to 255 characters',
      ]);
    });
    it('should invalidate when the email field is longer than 255 characters', () => {
      const isValid = sut.validate({
        ...props,
        email: 'a'.repeat(256),
      });
      expect(isValid).toBeFalsy();

      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ]);
    });

    it('should invalidate when the email format is invalid', () => {
      const isValid = sut.validate({ ...props, email: 'invalid_email' });
      expect(isValid).toBeFalsy();
      expect(sut.errors['email']).toStrictEqual(['email must be an email']);
    });
  });

  describe('Invalidate password', () => {
    it('should invalidate when the password field is null', () => {
      const isValid = sut.validate({ ...props, password: null as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ]);
    });
    it('should invalidate when the password field is empty', () => {
      const isValid = sut.validate({ ...props, password: '' });
      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ]);
    });
    it('should invalidate when the password field is longer than 100 characters', () => {
      const isValid = sut.validate({ ...props, password: 'a'.repeat(101) });
      expect(isValid).toBeFalsy();
      console.log(sut.errors['password']);
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ]);
    });
    it('should invalidate when the password field is not a string', () => {
      const isValid = sut.validate({ ...props, password: 10 as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['password']).toStrictEqual([
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ]);
    });
  });

  describe('Invalidate createdAt', () => {
    it('should invalidate when the password field is empty', () => {
      const isValid = sut.validate({ ...props, createdAt: '2023' as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
    it('should invalidate when the createdAt field is not a string', () => {
      const isValid = sut.validate({ ...props, createdAt: 10 as any });
      expect(isValid).toBeFalsy();
      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ]);
    });
  });
});
