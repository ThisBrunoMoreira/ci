import { ApplicationAction } from '../../../shared/application/use_case/use-case';
import { UserRepository } from '../../domain/repository/user.repository';
import { BcryptPasswordHasher } from '../../provider/hash-provider/bcryptjs-hash-provider';
import { OutputUser, UserOutputMapper } from '../dto/output-user.dto';
import { BadRequestError } from '../error/bad-request-error';
import { InvalidCredentialsError } from '../error/invalid-credentials-error';

export namespace SignInService {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = OutputUser;

  export class SignIn implements ApplicationAction<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: BcryptPasswordHasher,
    ) {}

    async executeSignIn(input: Input): Promise<Output> {
      const { email, password } = input;
      if (!email || !password) {
        throw new BadRequestError('input data not provided');
      }

      const entity = await this.userRepository.findByEmail(email);

      const hashPasswordMatcher = await this.hashProvider.compareHash(
        password,
        entity.password,
      );

      if (!hashPasswordMatcher) {
        throw new InvalidCredentialsError('Invalid credentials');
      }

      return UserOutputMapper.toOutput(entity);
    }
  }
}
