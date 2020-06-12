import express, { Request, Response } from 'express';

import { Users } from '../../models/users';

const router = express.Router();

router.get('/users', async (req: Request, res: Response) => {
  const users = new Users();
  const result = await users.getUsers();

  res.status(200).send(result);
});

export { router as getUsersRouter };
