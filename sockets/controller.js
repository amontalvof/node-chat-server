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
    socket.emit('receive-message', chatMessages.lastTenMessages);

    // connect him to a special room
    socket.join(user.id);

    // clean up when a user logs out
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
        io.emit('active-users', chatMessages.usersArr);
    });

    socket.on('send-message', ({ uid, message }) => {
        if (uid) {
            // private message
            socket
                .to(uid)
                .emit('private-message', { from: user.name, message });
        } else {
            chatMessages.sendMessage(user.id, user.name, message);
            io.emit('receive-message', chatMessages.lastTenMessages);
        }
    });
};

module.exports = { socketController };
