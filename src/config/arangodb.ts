export const arangoConfig = {
  url: process.env.ARANGO_URL || 'http://localhost:8529',
  username: process.env.ARANGO_USERNAME || 'root',
  password: process.env.ARANGO_PASSWORD || 'openSesame',
  dbName: 'conferencing',
  users: 'users',
  rooms: 'rooms',
};
