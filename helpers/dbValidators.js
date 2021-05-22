const { Role, User, Category, Product } = require('../models');

const isValidRole = async (role = '') => {
    const existsRole = await Role.findOne({ role });
    if (!existsRole) {
        throw new Error(`The ${role} is not registered in the database`);
    }
};

const emailExist = async (email = '') => {
    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
        throw new Error(`The email ${email} is already registered`);
    }
};

const existUserById = async (id = '') => {
    const existsUser = await User.findById(id);
    if (!existsUser) {
        throw new Error(
            `There is no user with id: ${id} registered in the database`
        );
    }
};

const existCategoryById = async (id = '') => {
    const existsCategory = await Category.findById(id);
    if (!existsCategory) {
        throw new Error(
            `There is no category with id: ${id} registered in the database`
        );
    }
};

const existProductById = async (id = '') => {
    const existsProduct = await Product.findById(id);
    if (!existsProduct) {
        throw new Error(
            `There is no product with id: ${id} registered in the database`
        );
    }
};

const allowedCollections = (collection = '', collections = []) => {
    const included = collections.includes(collection);
    if (!included) {
        throw new Error(
            `Collection ${collection} is not allowed, only the following collections [${collections}] are allowed`
        );
    }
    return true;
};

module.exports = {
    isValidRole,
    emailExist,
    existUserById,
    existCategoryById,
    existProductById,
    allowedCollections,
};
