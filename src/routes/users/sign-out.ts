import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  // set redis with ttl of 3600 secs. 

  res.send({});
});

export { router as signoutRouter };
