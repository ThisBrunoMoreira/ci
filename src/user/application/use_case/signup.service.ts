import { ApplicationAction } from '../../../shared/application/use_case/use-case';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repository/user.repository';
import { BcryptPasswordHasher } from '../../provider/hash-provider/bcryptjs-hash-provider';
import { OutputUser, UserOutputMapper } from '../dto/output-user.dto';
import { BadRequestError } from '../error/bad-request-error';

export namespace SignupService {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = OutputUser;

  export class Create implements ApplicationAction<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: BcryptPasswordHasher,
    ) {}

    async executeSignup(input: Input): Promise<Output> {
      const { email, name, password } = input;
      if (!email || !name || !password) {
        throw new BadRequestError('input data not provided');
      }

      await this.userRepository.emailExists(email);

      const hashPassword = await this.hashProvider.generateHash(password);

      const entity = new UserEntity(
        Object.assign(input, { password: hashPassword }),
      );

      await this.userRepository.create(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
