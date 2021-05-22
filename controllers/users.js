const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

const getUsers = async (req, res = response) => {
    const { from = 0, limit = 5 } = req.query;
    const query = { status: true };

    const [users, total] = await Promise.all([
        User.find(query).skip(Number(from)).limit(Number(limit)),
        User.countDocuments(query),
    ]);

    res.json({
        total,
        users,
    });
};

const postUsers = async (req, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // save to database
    await user.save();

    res.status(201).json({
        user,
    });
};

const putUsers = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    if (password) {
        // encrypt password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.status(200).json({ user });
};

const deleteUsers = async (req, res = response) => {
    const { id } = req.params;

    // delete from database
    // const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, { status: false });

    res.json({
        user,
    });
};

module.exports = {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers,
};
