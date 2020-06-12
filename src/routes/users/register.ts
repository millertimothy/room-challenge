import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middleware/validate-request';
import { User } from '../../models/user';

const router = express.Router();

router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 3, max: 20 })
      .isString()
      .withMessage('Username must be between 3 and 20 characters.'),
    body('password')
      .trim()
      .isString()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters.'),
    body('mobileToken')
      .optional()
      .isString()
      .withMessage('Mobile token must be a string.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username } = req.body;

    const user = new User(username);
    const result = await user.register(req.body);

    const token = jwt.sign(result, process.env.JWT_SECRET!, {
      expiresIn: 3600,
    });

    res.status(201).send(token);
  },
);

export { router as registerRouter };
