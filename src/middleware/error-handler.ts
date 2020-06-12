import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
import { setupArango } from '../utils/arangodb';

export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.message === 'database not found') {
    res.status(500).send({
      error: { message: 'There was an error connecting to the database.' },
    });
    return await setupArango();
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ error: err.formatError() });
  }

  console.log(err);
  res.status(400).send({
    error: {
      message: 'The server encountered an error processing the request.',
    },
  });
};
