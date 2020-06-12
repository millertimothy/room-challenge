import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware/validate-request';
import { User } from '../../models/user';

const router = express.Router();

router.get(
  '/user-rooms',
  [body('username').trim().exists().withMessage('Username must be supplied.')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username } = req.body;

    const user = new User(username);
    const result = await user.getUserRooms();

    res.status(201).send(result);
  },
);

export { router as getUserRoomsRouter };
