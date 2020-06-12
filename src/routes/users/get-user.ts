import express, { Request, Response } from 'express';

import { User } from '../../models/user';

const router = express.Router();

router.get(
  '/user/:username',
  async (req: Request, res: Response) => {
    const user = new User(req.params.username);
    const result = await user.getUser();

    res.status(200).send(result);
  },
);

export { router as getUserRouter };
