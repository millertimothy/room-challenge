import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { addRemoveParticipantRouter } from './routes/rooms/add-remove-participant';
import { changeHostRouter } from './routes/rooms/change-host';
import { createRoomRouter } from './routes/rooms/create-room';
import { getRoomInfoRouter } from './routes/rooms/get-room-info';
import { deleteUserRouter } from './routes/users/delete-user';
import { getUserRouter } from './routes/users/get-user';
import { getUserRoomsRouter } from './routes/users/get-user-rooms';
import { getUsersRouter } from './routes/users/get-users';
import { registerRouter } from './routes/users/register';
import { signInRouter } from './routes/users/sign-in';
import { updateUserRouter } from './routes/users/update-user';
import { errorHandler } from './middleware/error-handler';
import { setupArango } from './utils/arangodb';

const app = express();
app.use(json());

app.use(changeHostRouter);
app.use(createRoomRouter);
app.use(getRoomInfoRouter);
app.use(deleteUserRouter);
app.use(getUserRouter);
app.use(getUserRoomsRouter);
app.use(getUsersRouter);
app.use(addRemoveParticipantRouter);
app.use(registerRouter);
app.use(signInRouter);
app.use(updateUserRouter);

app.use(errorHandler);

const startup = async () => {
  await setupArango();

  app.listen(3000, () => {
    console.log('Listening on port 3000.');
  });
};
startup();
