import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware/validate-request';
import { DatabaseConnectionError } from '../../errors/database-connection-error';

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
    console.log('register user');
    const { username, password, mobileToken } = req.body;

    throw new DatabaseConnectionError();

    res.status(201).send();
  },
);

export { router as registerRouter };
