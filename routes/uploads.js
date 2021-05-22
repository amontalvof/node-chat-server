const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateFile } = require('../middlewares');
const { allowedCollections } = require('../helpers/dbValidators');
const {
    uploadImage,
    // updateImage,
    showImage,
    updateImageCloudinary
} = require('../controllers/uploads');

const router = Router();

router.post('/', validateFile, uploadImage);

router.put(
    '/:collection/:id',
    [
        validateFile,
        check('id', 'It is not a valid id').isMongoId(),
        check('collection').custom((collection) =>
            allowedCollections(collection, ['users', 'products'])
        ),
        validateFields,
    ],
    updateImageCloudinary
);

router.get(
    '/:collection/:id',
    [
        check('id', 'It is not a valid id').isMongoId(),
        check('collection').custom((collection) =>
            allowedCollections(collection, ['users', 'products'])
        ),
        validateFields,
    ],
    showImage
);

module.exports = router;
