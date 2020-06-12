import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware/validate-request';
import { authenticateUser } from '../../middleware/authorize-user';
import { Room } from '../../models/room';
import { User } from '../../models/user';

const router = express.Router();

router.put(
  '/change-host',
  [
    body('guid').trim().isString().withMessage('Room guid must be a string.'),
    body('newHost')
      .trim()
      .isString()
      .withMessage('New host username must be a string.'),
  ],
  validateRequest,
  authenticateUser,
  async (req: Request, res: Response) => {
    const { guid, newHost } = req.body;
    const { username } = req.user!;

    const user = new User(newHost);
    await user.getUser();
    const room = new Room();
    const result = await room.changeHost(guid, username, newHost);

    res.status(201).send(result);
  },
);

export { router as changeHostRouter };
