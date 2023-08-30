import { User } from '@prisma/client';
import { ClassValidatorFields } from '../../../../../shared/domain/erros/validation-erro';
import { UserEntity } from '../../../../domain/entities/user.entity';

export class UserModelMapper {
  static toEntity(model: User) {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
    };
    try {
      return new UserEntity(data, model.id);
    } catch {
      throw new ClassValidatorFields(
        'Failed to create entity from the provided data.',
      );
    }
  }
}
