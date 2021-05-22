require('dotenv').config();
const Server = require('./appServer');

const server = new Server();

server.listen();
