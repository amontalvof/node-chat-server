const { response } = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const validateJWT = async (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'There is no token in the request',
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY);
        const user = await User.findById(uid);

        // verify if the user exists
        if (!user) {
            return res.status(401).json({
                msg: 'User does not exist in database',
            });
        }

        // verify if user is active
        if (!user.status) {
            return res.status(401).json({
                msg: 'Authenticated user is inactive',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token',
        });
    }
};

module.exports = { validateJWT };
