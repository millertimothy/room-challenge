import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware/validate-request';
import { Room } from '../../models/room';

const router = express.Router();

router.get(
  '/room-info',
  [body('guid').trim().exists().withMessage('Room guid must be supplied.')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { guid } = req.body;

    const room = new Room();
    const result = await room.getRoomInfo(guid);

    res.status(201).send(result);
  },
);

export { router as getRoomInfoRouter };
