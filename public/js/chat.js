const url = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080/api/auth/'
    : 'https://am-node-restserver.herokuapp.com/api/auth/';

let user = null;
let socket = null;

// HTML REFERENCES
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout = document.querySelector('#btnLogout');

const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';
    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('There is no token on the server');
    }

    const resp = await fetch(url, { headers: { 'x-token': token } });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;

    await connectSocket();
};

const connectSocket = async () => {
    socket = io({
        extraHeaders: {
            'x-token': localStorage.getItem('token'),
        },
    });

    socket.on('connect', () => {
        console.log('Socket online');
    });

    socket.on('disconnect', () => {
        console.log('Socket offline');
    });

    socket.on('receive-message', () => {
        // TODO:
    });

    socket.on('active-users', (payload) => {
        console.log(payload);
    });

    socket.on('private-message', () => {
        // TODO:
    });
};

const main = async () => {
    await validateJWT();
};

main();
