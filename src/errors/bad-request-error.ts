// Paid some attention to proving useful error to the client. 
import { CustomError } from './custom-error';

// Username or password is invalid.
// Room is at maximum capacity.
export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  formatError() {
    return { message: this.message };
  }
}
