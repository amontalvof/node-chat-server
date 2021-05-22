const { response } = require('express');

const isAdminRole = (req, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'You want to verify the role without validating the token',
        });
    }
    const { role, name } = req.user;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not an administrator, he does not have permission to perform this operation`,
        });
    }
    next();
};

const hasRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'You want to verify the role without validating the token',
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `One of these roles [${roles}] are required to perform this operation`,
            });
        }
        next();
    };
};

module.exports = { isAdminRole, hasRole };
