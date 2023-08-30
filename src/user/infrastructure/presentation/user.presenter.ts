import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../../../shared/infrastructure/presentation/collection.presenter';
import { OutputUser } from '../../application/dto/output-user.dto';
import { DetailUsersService } from '../../application/use_case/detail-users.service';
export class UserPresenter {
  id: string;
  name: string;
  email: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: OutputUser) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(output: DetailUsersService.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new UserPresenter(item));
  }
}
