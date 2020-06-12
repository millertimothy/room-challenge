import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware/validate-request';

import { Room } from '../../models/room';
import { authenticateUser } from '../../middleware/authorize-user';

const router = express.Router();

router.post(
  '/create-room',
  [
    body('name')
      .isLength({ min: 3, max: 20 })
      .withMessage('Room name must be between 3 and 20 characters.'),
    body('capacity')
      .optional()
      .matches(/^[1-9]\d*$/g)
      .withMessage('Capacity must be a positive integer'),
  ],
  validateRequest,
  authenticateUser,
  async (req: Request, res: Response) => {
    const { name, capacity = 5 } = req.body;
    const { username: host } = req.user!;

    const room = new Room();
    const result = await room.createRoom({ name, capacity, host });

    res.status(201).send(result);
  },
);

export { router as createRoomRouter };
