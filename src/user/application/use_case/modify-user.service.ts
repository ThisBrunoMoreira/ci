import { ApplicationAction } from '../../../shared/application/use_case/use-case';
import { UserRepository } from '../../domain/repository/user.repository';
import { OutputUser, UserOutputMapper } from '../dto/output-user.dto';
import { BadRequestError } from '../error/bad-request-error';

export namespace ModifyUserService {
  export type Input = {
    id: string;
    name: string;
  };

  export type Output = OutputUser;

  export class UserProfileModification
    implements ApplicationAction<Input, Output>
  {
    constructor(private userRepository: UserRepository.Repository) {}

    async update(input: Input): Promise<Output> {
      if (!input.name) {
        throw new BadRequestError('Name not provided');
      }
      const entity = await this.userRepository.findOne(input.id);
      entity.updateUserName(input.name);
      await this.userRepository.update(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
