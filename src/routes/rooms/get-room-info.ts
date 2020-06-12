import express, { Request, Response } from 'express';

import { Room } from '../../models/room';

const router = express.Router();

router.get(
  '/room-info/:guid',
  async (req: Request, res: Response) => {
    const room = new Room();
    const result = await room.getRoomInfo(req.params.guid);

    res.status(201).send(result);
  },
);

export { router as getRoomInfoRouter };
