import { ApplicationAction } from '../../../shared/application/use_case/use-case';
import { UserRepository } from '../../domain/repository/user.repository';

export namespace RemoveUserService {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UserProfile implements ApplicationAction<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async remove(input: Input): Promise<Output> {
      await this.userRepository.remove(input.id);
    }
  }
}
