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
      .withMessage('Username must be between 3 and 20 characters.'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters.'),
    body('mobileToken').optional(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, mobileToken = null } = req.body;

    const user = new User();
    await user.save(req.body);

    const token = jwt.sign({ username, mobileToken }, process.env.JWT_SECRET!, {
      expiresIn: 3600,
    });

    res.status(201).send(token);
  },
);

export { router as registerRouter };
