import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { authenticateUser } from '../../middleware/authorize-user';
import { User } from '../../models/user';
import { validateRequest } from '../../middleware/validate-request';

const router = express.Router();

router.put(
  '/update-user',
  [
    body('password')
      .optional()
      .isString()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters.'),
    body('mobileToken').optional().isString(),
  ],
  authenticateUser,
  validateRequest,
  async (req: Request, res: Response) => {
    const { username } = req.user!;

    const user = new User(username);
    const result = await user.updateUser(req.body);

    res.status(200).send(result);
  },
);

export { router as updateUserRouter };
