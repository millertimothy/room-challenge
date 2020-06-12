import express, { Request, Response } from 'express';

import { authenticateUser } from '../../middleware/authorize-user';
import { User } from '../../models/user';

const router = express.Router();

router.delete(
  '/user',
  authenticateUser,
  async (req: Request, res: Response) => {
    const { username } = req.user!;

    const user = new User(username);
    const result = await user.deleteUser();

    res.status(200).send(result);
  },
);

export { router as deleteUserRouter };
