import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware/validate-request';
import { authenticateUser } from '../../middleware/authorize-user';
import { Room } from '../../models/room';

const router = express.Router();

router.put(
  '/add-remove-participant',
  [
    body('guid')
      .trim()
      .exists()
      .withMessage('Room guid must be supplied.')
      .isString()
      .withMessage('Room guid must be a string.'),
    body('action')
      .trim()
      .exists()
      .withMessage('Action type must be supplied.')
      .isString()
      .withMessage('Action type must be a string.'),
  ],
  validateRequest,
  authenticateUser,
  async (req: Request, res: Response) => {
    const { guid, action } = req.body;
    const { username } = req.user!;

    const room = new Room();
    const result = await room.addRemoveParticipant(guid, username, action);

    res.status(201).send(result);
  },
);

export { router as addRemoveParticipantRouter };
