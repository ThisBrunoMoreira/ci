import { ValidationError, validateSync } from 'class-validator';
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-field.interface';

export abstract class ClassValidatorFields<T extends object>
  implements ValidatorFieldsInterface<T>
{
  errors: FieldsErrors = {};
  validatedData: T | null = null;

  validate(data: T): boolean {
    const errors: ValidationError[] = validateSync(data);

    if (errors.length > 0) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      this.validatedData = data;
    }

    return !errors.length;
  }
}
