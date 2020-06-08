import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
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
    body('mobile_token').optional(),
  ],
  (req: Request, res: Response) => {},
);

export { router as registerRouter };
