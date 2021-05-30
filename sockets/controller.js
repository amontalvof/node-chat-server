const { checkJWT } = require('../helpers/generateJWT');
const ChatMessages = require('../chatMessages');

const chatMessages = new ChatMessages();

const socketController = async (socket, io) => {
    const token = socket.handshake.headers['x-token'];
    const user = await checkJWT(token);
    if (!user) {
        return socket.disconnect();
    }
    // Add connected user
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.usersArr);

    // clean up when a user logs out
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
    });
};

module.exports = { socketController };
