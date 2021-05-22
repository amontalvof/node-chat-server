const jwt = require('jsonwebtoken');
const colors = require('colors/safe');

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

module.exports = generateJWT;
