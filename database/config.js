const colors = require('colors/safe');
const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log(colors.cyan('Online database!'));
    } catch (error) {
        console.log(error);
        throw new Error(colors.magenta('Database connection failed!'));
    }
};

module.exports = { dbConnection };
