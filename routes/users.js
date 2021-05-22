const { Router } = require('express');
const { check } = require('express-validator');
const {
    validateFields,
    validateJWT,
    isAdminRole,
    hasRole,
} = require('../middlewares');
const {
    isValidRole,
    emailExist,
    existUserById,
} = require('../helpers/dbValidators');
const {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers,
} = require('../controllers/users');

const router = Router();

router.get('/', getUsers);

router.post(
    '/',
    [
        check('name', 'The name is required').not().isEmpty(),

        check('password', 'The password must be more than 6 letters').isLength({
            min: 6,
        }),
        check('email', 'The email is not valid').isEmail(),
        // check('role', 'It is not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom(isValidRole),
        check('email').custom(emailExist),
        validateFields,
    ],
    postUsers
);

router.put(
    '/:id',
    [
        check('id', 'It is not a valid id').isMongoId(),
        check('id').custom(existUserById),
        check('role').custom(isValidRole),
        validateFields,
    ],
    putUsers
);

router.delete(
    '/:id',
    [
        validateJWT,
        // isAdminRole,
        hasRole('ADMIN_ROLE', 'SALES_ROLE'),
        check('id', 'It is not a valid id').isMongoId(),
        check('id').custom(existUserById),
        validateFields,
    ],
    deleteUsers
);

module.exports = router;
