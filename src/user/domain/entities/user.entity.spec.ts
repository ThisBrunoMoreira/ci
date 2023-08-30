import { UserDataBuilder } from '../testing/helpers/user-data-builder';
import { UserEntity, UserProps } from './user.entity';

describe('UserEntity unit test', () => {
  let sut: UserEntity;
  let props: UserProps;

  beforeEach(() => {
    UserEntity.validateProps = jest.fn();
    props = UserDataBuilder({});
    sut = new UserEntity(props);
  });

  describe('Constructor method', () => {
    it('should call validateProps during construction', () => {
      expect(UserEntity.validateProps).toHaveBeenCalled();
    });
    it('should set the correct name', () => {
      expect(sut.name).toEqual(props.name);
    });

    it('should set the correct email', () => {
      expect(sut.email).toEqual(props.email);
    });

    it('should set the correct password', () => {
      expect(sut.password).toEqual(props.password);
    });

    it('should set createdAt property to an instance of Date', () => {
      expect(sut.createdAt).toBeInstanceOf(Date);
    });
  });
  describe('Getter methods', () => {
    it('should return the correct name', () => {
      const name = sut.name;
      expect(name).toBeDefined();
      expect(name).toEqual(props.name);
      expect(typeof name).toEqual('string');
    });

    it('should return the correct email', () => {
      const email = sut.email;
      expect(email).toBeDefined();
      expect(email).toEqual(props.email);
      expect(typeof email).toEqual('string');
    });

    it('should return the correct password', () => {
      const password = sut.password;
      expect(password).toBeDefined();
      expect(password).toEqual(props.password);
      expect(typeof password).toEqual('string');
    });
  });
  describe('Setter methods', () => {
    it('should set the name field', () => {
      sut['name'] = 'any name';
      expect(sut.name).toEqual('any name');
    });
    it('should set the password field', () => {
      sut['password'] = 'any password';
      expect(sut.password).toEqual('any password');
      expect(typeof sut.password).toBe('string');
    });
  });
  describe('createdAt property', () => {
    it('should call validateProps during construction', () => {
      expect(UserEntity.validateProps).toHaveBeenCalled();
    });
    it('should be defined', () => {
      expect(sut.createdAt).toBeDefined();
    });
    it('should be an instance of Date', () => {
      expect(sut.createdAt).toBeInstanceOf(Date);
    });
  });
  describe('update methods', () => {
    it('should call validateProps during construction', () => {
      expect(UserEntity.validateProps).toHaveBeenCalled();
    });
    it('should update the user name', () => {
      sut.updateUserName('other name');
      expect(sut.name).toEqual('other name');
    });

    it('should update the user password', () => {
      sut.updateUserPassword('other password');
      expect(sut.password).toEqual('other password');
    });
  });
});
