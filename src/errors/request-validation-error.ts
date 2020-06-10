import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  formatError() {
    return {
      message: 'Invalid request parameters',
      invalidParams: this.errors.map((err) => ({
        reason: err.msg,
        name: err.param,
      })),
    };
  }
}
