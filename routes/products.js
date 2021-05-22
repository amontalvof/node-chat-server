const { Router } = require('express');
const { check } = require('express-validator');
const {
    existProductById,
    existCategoryById,
} = require('../helpers/dbValidators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/products');

const router = Router();

/**
 ** /api/products
 */

// get all products
router.get('/', getProducts);

// get a product by id
router.get(
    '/:id',
    [
        check('id', 'It is not a valid id').isMongoId(),
        check('id').custom(existProductById),
        validateFields,
    ],
    getProduct
);

// create a product, anyone with a valid token
router.post(
    '/',
    [
        validateJWT,
        check('name', 'The name is required').not().isEmpty(),
        check('category', 'Category is not a valid id').isMongoId(),
        check('category').custom(existCategoryById),
        validateFields,
    ],
    createProduct
);

// update a product, anyone with a valid token
router.put(
    '/:id',
    [
        validateJWT,
        check('id', 'It is not a valid id').isMongoId(),
        check('id').custom(existProductById),
        validateFields,
    ],
    updateProduct
);

// delete a product, only a user with role admin
router.delete(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'It is not a valid id').isMongoId(),
        check('id').custom(existProductById),
        validateFields,
    ],
    deleteProduct
);

module.exports = router;
