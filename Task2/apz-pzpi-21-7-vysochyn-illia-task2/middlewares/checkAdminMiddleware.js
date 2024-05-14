const jwt = require('jsonwebtoken');
const { secret } = require("../config");
const Users = require("../models/Users");

const checkAdminMiddleware = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({message: 'Unauthorized. Token missing.'});
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Unauthorized. Token missing.'});
    }
    try {
        req.user = jwt.verify(token, secret);
        const user = await Users.findOne({username: req.user.username})
        if (req.user.role === 'admin' && user) {
            next();
        } else {
            res.status(403).json({message: 'Access denied. Admin role required.'});
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({message: 'Unauthorized. Invalid token.'});
    }
};

module.exports = checkAdminMiddleware;