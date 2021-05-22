const express = require('express');
const cors = require('cors');
const colors = require('colors/safe');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('./database/config');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads',
            users: '/api/users',
        };

        // DB connection
        this.connectDB();

        // middlewares
        this.middlewares();

        //routes of my app
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // reading and parsing the body
        this.app.use(express.json());

        // public directory
        this.app.use(express.static('public'));

        // fileUpload
        this.app.use(
            fileUpload({
                useTempFiles: true,
                tempFileDir: '/tmp/',
                createParentPath: true,
            })
        );
    }

    routes() {
        this.app.use(this.paths.auth, require('./routes/auth'));
        this.app.use(this.paths.categories, require('./routes/categories'));
        this.app.use(this.paths.products, require('./routes/products'));
        this.app.use(this.paths.search, require('./routes/search'));
        this.app.use(this.paths.uploads, require('./routes/uploads'));
        this.app.use(this.paths.users, require('./routes/users'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(colors.cyan('Server running on port', this.port));
        });
    }
}

module.exports = Server;
