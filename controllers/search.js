const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');

const allowedCollections = ['users', 'roles', 'categories', 'products'];

const searchUsers = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: user ? [user] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const [users, total] = await Promise.all([
        User.find({
            $or: [{ name: regex }, { email: regex }],
            $and: [{ status: true }],
        }),
        User.countDocuments({
            $or: [{ name: regex }, { email: regex }],
            $and: [{ status: true }],
        }),
    ]);

    res.json({ total, results: users });
};

const searchCategories = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const category = await Category.findById(term).populate('user', 'name');
        return res.json({
            results: category ? [category] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const [categories, total] = await Promise.all([
        Category.find({ name: regex, status: true }).populate('user', 'name'),
        Category.countDocuments({ name: regex, status: true }),
    ]);

    res.json({ total, results: categories });
};

const searchProducts = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const product = await Product.findById(term)
            .populate('user', 'name')
            .populate('category', 'name');
        return res.json({
            results: product ? [product] : [],
        });
    }

    const regex = new RegExp(term, 'i');

    const [products, total] = await Promise.all([
        Product.find({ name: regex, status: true })
            .populate('user', 'name')
            .populate('category', 'name'),
        Product.countDocuments({ name: regex, status: true }),
    ]);

    res.json({ total, results: products });
};

const search = (req, res = response) => {
    const { collection, term } = req.params;
    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `The allowed collections are: ${allowedCollections}`,
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'I forgot to do this search',
            });
            break;
    }
};

module.exports = { search };
