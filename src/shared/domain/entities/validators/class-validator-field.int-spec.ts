import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ClassValidatorFields } from './class-validator-field';

class StubRules {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;

  constructor(data: any) {
    Object.assign(this, data);
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: StubRules): boolean {
    return super.validate(new StubRules(data));
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('Should validate with errors', () => {
    const validator = new StubClassValidatorFields();

    expect(validator.validate(null)).toBeFalsy();
    expect(validator.errors).toStrictEqual({
      name: ['name must be a string', 'name should not be empty'],
      price: [
        'price must be a number conforming to the specified constraints',
        'price should not be empty',
      ],
    });
  });
  it('Should validate without errors', () => {
    const validator = new StubClassValidatorFields();

    expect(validator.validate({ name: 'any name', price: 5 })).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: 'any name', price: 5 }),
    );
  });
});
