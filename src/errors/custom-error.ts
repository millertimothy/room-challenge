export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract formatError(): {
    message: string;
    invalidParams?: { name: string; reason: string }[];
  };
}

/* 
Like an interface but allows unimplemented methods. These methods are called abstract methods. 
We can't create an instance of an abstract class.
*/