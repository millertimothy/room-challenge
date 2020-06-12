import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middleware/validate-request';
import { User } from '../../models/user';

const router = express.Router();

router.post(
  '/sign-in',
  [
    body('username').notEmpty().withMessage('Please supply a username.'),
    body('password').trim().notEmpty().withMessage('Please supply a password.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = new User(username);
    const result = await user.signIn(password);

    const token = jwt.sign(result, process.env.JWT_SECRET!);

    res.status(200).send(token);
  },
);

export { router as signInRouter };
