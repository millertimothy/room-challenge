import { CustomError } from './custom-error';

export class ConflictingKeyError extends CustomError {
  statusCode = 409;

  constructor() {
    super('Document already exists in database collection.');

    Object.setPrototypeOf(this, ConflictingKeyError.prototype);
  }

  formatError() {
    return {
      message: 'Document already exists in database collection.',
      invalidParams: [{ name: '_key', reason: 'Unique constraint violated.' }],
    };
  }
}
