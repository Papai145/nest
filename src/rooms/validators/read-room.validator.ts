import { ValidationError, BadRequestException } from '@nestjs/common';

export function readRoomValidator(validationErrors: ValidationError[]) {
  if (!validationErrors || validationErrors.length === 0) {
    return new BadRequestException('Validation failed.');
  }

  const messages = validationErrors.map((error) => {
    const field = error.property;
    const constraints = error.constraints;

    if (constraints && constraints.isNumber) {
      return `Field "${field}" must be a number.`;
    }
    return `Validation failed for field "${field}".`;
  });
  const result = messages.join('\n');
  // console.log(result);

  return new BadRequestException(result);
}
