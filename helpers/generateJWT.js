const jwt = require('jsonwebtoken');
const colors = require('colors/safe');
const { User } = require('../models');

const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.SECRET_JWT_KEY,
            {
                expiresIn: '4h',
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject(
                        colors.magenta('Could not generate the json web token')
                    );
                } else {
                    resolve(token);
                }
            }
        );
    });
};

const checkJWT = async (token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY);
        const user = await User.findById(uid);
        if (user) {
            if (user.status) {
                return user;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

module.exports = { generateJWT, checkJWT };
