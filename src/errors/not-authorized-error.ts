import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('You are not authorized to make this request.');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  formatError() {
    return { message: 'You are not authorized to make this request.' };
  }
}
