import { Entity } from '../../../shared/domain/entities/entity';
import { EntityValidationError } from '../../../shared/domain/erros/validation-erro';
import { UserValidatorFactory } from '../validators/user.validator';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(public readonly props: UserProps, id?: string) {
    UserEntity.validateProps(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }
  private set password(value: string) {
    this.props.password = value;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  updateUserName(value: string): void {
    UserEntity.validateProps({
      ...this.props,
      name: value,
    });
    this.name = value;
  }
  updateUserPassword(value: string): void {
    UserEntity.validateProps({
      ...this.props,
      password: value,
    });
    this.password = value;
  }

  static validateProps(props: UserProps): void {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
