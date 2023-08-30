import { HashingService } from '../../../shared/application/provider/hash-provider';
import { ApplicationAction } from '../../../shared/application/use_case/use-case';
import { UserRepository } from '../../domain/repository/user.repository';
import { OutputUser, UserOutputMapper } from '../dto/output-user.dto';
import { InvalidPasswordError } from '../error/invalid-password-error';

export namespace PasswordModificationService {
  export type Input = {
    id: string;
    password: string;
    oldPassword: string;
  };

  export type Output = OutputUser;

  export class passwordModification
    implements ApplicationAction<Input, Output>
  {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashingService: HashingService,
    ) {}

    async update(input: Input): Promise<Output> {
      const entity = await this.userRepository.findOne(input.id);

      if (!input.password || !input.oldPassword) {
        throw new InvalidPasswordError(
          'Both old password and new password are required.',
        );
      }

      const isOldPasswordCorrect = await this.hashingService.compareHash(
        input.oldPassword,
        entity.password,
      );

      if (!isOldPasswordCorrect) {
        throw new InvalidPasswordError('Password is incorrect.');
      }

      const hashedPassword = await this.hashingService.generateHash(
        input.password,
      );

      entity.updateUserPassword(hashedPassword);
      await this.userRepository.update(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
