import {
  PaginatedItems,
  PaginatedItemsMapper,
} from '../../../shared/application/dto/pagination-output.dto';
import { SearchInput } from '../../../shared/application/dto/search-input.dto';
import { ApplicationAction } from '../../../shared/application/use_case/use-case';
import { UserRepository } from '../../domain/repository/user.repository';
import { OutputUser, UserOutputMapper } from '../dto/output-user.dto';

export namespace DetailUsersService {
  export type Input = SearchInput;

  export type Output = PaginatedItems<OutputUser>;

  export class UsersProfile implements ApplicationAction<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async findAll(input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(input);
      const searchResult = await this.userRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: UserRepository.SearchResult): Output {
      const items = searchResult.items.map((item) => {
        return UserOutputMapper.toOutput(item);
      });
      return PaginatedItemsMapper.toPaginatedItems(items, searchResult);
    }
  }
}
