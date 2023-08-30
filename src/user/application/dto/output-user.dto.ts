import { UserEntity } from '../../domain/entities/user.entity';

export type OutputUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export class UserOutputMapper {
  static toOutput(entity: UserEntity): OutputUser {
    return entity.toJSON();
  }
}
