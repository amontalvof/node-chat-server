const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');
const generateJWT = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/googleVerify');

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        // check if the email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Email not exists',
            });
        }

        // check if user is active
        if (!user.status) {
            return res.status(400).json({
                msg: 'User not active',
            });
        }

        // check if the password is correct
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Password is incorrect',
            });
        }

        // generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something went wrong',
        });
    }
};

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { email, name, img } = await googleVerify(id_token);
        let user = await User.findOne({ email });
        if (!user) {
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true,
            };
            user = new User(data);
            await user.save();
        }

        if (!user.status) {
            res.status(401).json({
                msg: 'User not active, talk to administrator',
            });
        }

        // generate JWT
        const token = await generateJWT(user.id);

        res.json({
            token,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Google token is not valid',
        });
    }
};

module.exports = { login, googleSignIn };
