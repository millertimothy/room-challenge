import express, { Request, Response } from 'express';

import { User } from '../../models/user';

const router = express.Router();

router.get('/user-rooms/:username', async (req: Request, res: Response) => {
  const user = new User(req.params.username);
  const result = await user.getUserRooms();

  res.status(201).send(result);
});

export { router as getUserRoomsRouter };
