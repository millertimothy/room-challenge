export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract formatErrors(): {
    message: string;
    invalidParams?: { name: string; reason: string }[];
  };
}
