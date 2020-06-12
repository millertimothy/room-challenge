import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors/not-authorized-error';

interface UserPayload {
  username: string;
  mobileToken?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    throw new NotAuthorizedError();
  }
  
  try {
    const userPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as UserPayload;
    req.user = userPayload;
  } catch (err) {
    throw new NotAuthorizedError();
  }

  next();
};
