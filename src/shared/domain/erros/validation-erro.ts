import { FieldsErrors } from '../entities/validators/validator-field.interface';

export class ClassValidatorFields extends Error {}

export class EntityValidationError extends Error {
  constructor(public error: FieldsErrors) {
    super('Entity Validation Error');
    this.name = 'EntityValidationError';
  }
}
