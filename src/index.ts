import express from 'express';
import { json } from 'body-parser';

import { changeHostRouter } from './routes/rooms/change-host';
import { createRoomRouter } from './routes/rooms/create-room';
import { getRoomInfoRouter } from './routes/rooms/get-room-info';
import { deleteUserRouter } from './routes/users/delete-user';
import { getUserRouter } from './routes/users/get-user';
import { getUserRoomsRouter } from './routes/users/get-user-rooms';
import { getUsersRouter } from './routes/users/get-users';
import { joinLeaveRoomRouter } from './routes/users/join-leave-room';
import { registerRouter } from './routes/users/register';
import { signInRouter } from './routes/users/sign-in';
import { updateUserRouter } from './routes/users/update-user';

const app = express();
app.use(json());

app.use(changeHostRouter);
app.use(createRoomRouter);
app.use(getRoomInfoRouter);
app.use(deleteUserRouter);
app.use(getUserRouter);
app.use(getUserRoomsRouter);
app.use(getUsersRouter);
app.use(joinLeaveRoomRouter);
app.use(registerRouter);
app.use(signInRouter);
app.use(updateUserRouter);

app.listen(3000, () => {
  console.log('Listening on port 3000.');
});
