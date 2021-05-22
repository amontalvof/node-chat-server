const path = require('path');
const fs = require('fs');
const { response } = require('express');
const cloudinary = require('cloudinary').v2;
const { uploadFile } = require('../helpers/uploadFile');
const { User, Product } = require('../models');

cloudinary.config(process.env.CLOUDINARY_URL);

const uploadImage = async (req, res = response) => {
    try {
        // const fileName = await uploadFile(req.files, ['txt', 'md'], 'textos');
        const fileName = await uploadFile(req.files, undefined, 'images');
        res.json({ name: fileName });
    } catch (error) {
        res.status(400).json({ error });
    }
};

const updateImage = async (req, res = response) => {
    const { id, collection } = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id ${id} in the database`,
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no product with the id ${id} in the database`,
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }
    // remove previous images
    if (model.img) {
        // delete image from server
        const imagePath = path.join(
            __dirname,
            '../uploads',
            collection,
            model.img
        );
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    const fileName = await uploadFile(req.files, undefined, collection);
    model.img = fileName;
    await model.save();
    res.json(model);
};

const updateImageCloudinary = async (req, res = response) => {
    const { id, collection } = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id ${id} in the database`,
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no product with the id ${id} in the database`,
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }
    // remove previous images
    if (model.img) {
        // delete image from server
        const nameArr = model.img.split('/');
        const name = nameArr[nameArr.length - 1];
        const [publicId] = name.split('.');
        cloudinary.uploader.destroy(publicId);
    }
    const { tempFilePath } = req.files.sampleFile;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;
    await model.save();
    res.json(model);
};

const showImage = async (req, res = response) => {
    const { id, collection } = req.params;
    let model;
    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id ${id} in the database`,
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `There is no product with the id ${id} in the database`,
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }

    if (model.img) {
        const imagePath = path.join(
            __dirname,
            '../uploads',
            collection,
            model.img
        );
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
    }
    const notFoundImgPath = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(notFoundImgPath);
};

module.exports = { uploadImage, updateImage, showImage, updateImageCloudinary };
