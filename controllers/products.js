const { response } = require('express');
const { Product } = require('../models');

// getProducts - paged - total - population
const getProducts = async (req, res = response) => {
    const { from = 0, limit = 5 } = req.query;
    const query = { status: true };

    const [product, total] = await Promise.all([
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit)),
        Product.countDocuments(query),
    ]);

    res.json({
        total,
        product,
    });
};

// getProduct - population
const getProduct = async (req, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');
    res.json(product);
};

const createProduct = async (req, res = response) => {
    const { status, user, ...body } = req.body;
    const productDB = await Product.findOne({ name: body.name });

    if (productDB) {
        return res.status(400).json({
            msg: `Product ${productDB.name} already exists`,
        });
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    };

    const product = new Product(data);
    await product.save();

    res.status(201).json({
        product,
    });
};

const updateProduct = async (req, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;
    if (data.name) {
        data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    res.json(product);
};

const deleteProduct = async (req, res = response) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
    );
    res.json(deletedProduct);
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
