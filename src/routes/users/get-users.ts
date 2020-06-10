import express, { Request, Response } from 'express';

import { User } from '../../models/user';

const router = express.Router();

router.get('/users', async (req: Request, res: Response) => {

  const user = new User();
  const result = await user.getUsers();

  res.status(200).send(result);
});

export { router as getUsersRouter };
