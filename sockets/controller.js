const { checkJWT } = require('../helpers/generateJWT');

const socketController = async (socket) => {
    const token = socket.handshake.headers['x-token'];
    const user = await checkJWT(token);
    if (!user) {
        return socket.disconnect();
    }
    console.log('Connected', user.name);
};

module.exports = { socketController };
