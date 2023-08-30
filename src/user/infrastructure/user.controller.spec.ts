import { OutputUser } from '../application/dto/output-user.dto';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presentation/user.presenter';
import { UserController } from './user.controller';

describe('UserController unit test', () => {
  let userController: UserController;
  let userId: string;
  let outputUser: OutputUser;

  beforeEach(() => {
    userController = new UserController();
    userId = 'df96ae94-6128-486e-840c-b6f78abb4801';
    outputUser = {
      id: userId,
      name: 'John Doe',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const signupInput = {
        name: 'John Doe',
        email: 'a@a.com',
        password: '1234',
      };

      const mockSignupService = {
        executeSignup: jest.fn().mockResolvedValue(outputUser),
      };
      userController['signupCreate'] = mockSignupService as any;

      const presenter = await userController.createUser(signupInput);
      expect(presenter).toBeInstanceOf(UserPresenter);
      expect(presenter).toStrictEqual(new UserPresenter(outputUser));
      expect(mockSignupService.executeSignup).toHaveBeenCalledWith(signupInput);
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      const output = 'fake_token';
      const signinInput = {
        email: 'a@a.com',
        password: '1234',
      };

      const mockSignInService = {
        executeSignIn: jest.fn().mockResolvedValue(output),
      };
      const mockAuthService = {
        generateJwt: jest.fn().mockResolvedValue(output),
      };
      userController['signIn'] = mockSignInService as any;
      userController['authService'] = mockAuthService as any;

      const result = await userController.loginUser(signinInput);
      expect(result).toEqual(output);
      expect(mockSignInService.executeSignIn).toHaveBeenCalledWith(signinInput);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateInput = {
        name: 'new_name',
      };

      const mockModifyUserService = {
        update: jest.fn().mockResolvedValue(outputUser),
      };
      userController['modifyUserProfile'] = mockModifyUserService as any;

      const presenter = await userController.updateUser(userId, updateInput);

      expect(presenter).toBeInstanceOf(UserPresenter);
      expect(presenter).toStrictEqual(new UserPresenter(outputUser));
      expect(mockModifyUserService.update).toHaveBeenCalledWith({
        id: userId,
        ...updateInput,
      });
    });
  });

  describe('updateUserPassword', () => {
    it("should update a user's password successfully", async () => {
      const passwordUpdateInput = {
        password: 'new_password',
        oldPassword: 'old_password',
      };

      const mockPasswordModificationService = {
        update: jest.fn().mockResolvedValue(outputUser),
      };
      userController['passwordModification'] =
        mockPasswordModificationService as any;

      const presenter = await userController.updateUserPassword(
        userId,
        passwordUpdateInput,
      );

      expect(presenter).toBeInstanceOf(UserPresenter);
      expect(presenter).toStrictEqual(new UserPresenter(outputUser));
      expect(mockPasswordModificationService.update).toHaveBeenCalledWith({
        id: userId,
        ...passwordUpdateInput,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const mockRemoveUserService = {
        remove: jest.fn().mockResolvedValue(undefined),
      };
      userController['removeUserProfile'] = mockRemoveUserService as any;

      const result = await userController.deleteUser(userId);

      expect(result).toBeUndefined();
      expect(mockRemoveUserService.remove).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('getUserById', () => {
    it('should retrieve a user profile by ID', async () => {
      const mockDetailUserService = {
        findOne: jest.fn().mockResolvedValue(outputUser),
      };
      userController['userProfile'] = mockDetailUserService as any;

      const presenter = await userController.getUserById(userId);

      expect(presenter).toBeInstanceOf(UserPresenter);
      expect(presenter).toStrictEqual(new UserPresenter(outputUser));
      expect(mockDetailUserService.findOne).toHaveBeenCalledWith({
        id: userId,
      });
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve all user profiles', async () => {
      const usersList = {
        items: [outputUser],
        total: 1,
        currentPage: 1,
        lastPage: 1,
        perPage: 1,
      };

      const mockDetailAllUsersService = {
        findAll: jest.fn().mockResolvedValue(usersList),
      };
      userController['usersProfile'] = mockDetailAllUsersService as any;

      const searchParams = {
        page: 1,
        perPage: 1,
      };
      const presenter = await userController.getAllUsers(searchParams);

      expect(presenter).toBeInstanceOf(UserCollectionPresenter);
      expect(presenter).toEqual(new UserCollectionPresenter(usersList));
      expect(mockDetailAllUsersService.findAll).toHaveBeenCalledWith(
        searchParams,
      );
    });
  });
});
