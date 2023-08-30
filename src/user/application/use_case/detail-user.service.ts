import { ApplicationAction } from '../../../shared/application/use_case/use-case';
import { UserRepository } from '../../domain/repository/user.repository';
import { OutputUser, UserOutputMapper } from '../dto/output-user.dto';

export namespace DetailUserService {
  export type Input = {
    id: string;
  };

  export type Output = OutputUser;

  export class UserProfile implements ApplicationAction<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async findOne(input: Input): Promise<Output> {
      const entity = await this.userRepository.findOne(input.id);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
