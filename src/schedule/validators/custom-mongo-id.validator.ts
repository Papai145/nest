import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  //   ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ async: false })
export class CustomMongoIdConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return mongoose.isValidObjectId(value);
  }

  defaultMessage() {
    return `must be a valid MongoDB ObjectId`;
  }
}

export function IsCustomMongoId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CustomMongoIdConstraint,
    });
  };
}
