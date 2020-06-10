import { CustomError } from './custom-error';

export class DocumentNotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Document could not be found.');

    Object.setPrototypeOf(this, DocumentNotFoundError.prototype);
  }

  formatError() {
    return { message: 'Document could not be found.' };
  }
}
