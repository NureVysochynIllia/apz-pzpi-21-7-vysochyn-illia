const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const Users = require("../models/Users");

const checkAuthorizedMiddleware = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(403).json({message: 'User is not authorized'});
        }
        req.user = jwt.verify(token, secret);
        const user = await Users.findOne({username: req.user.username})
        if(user) {
            next();
        }
        else{
            res.status(401).json({message: 'Unauthorized. Invalid token.'});
        }
    } catch (error) {
        console.error(error);
        return res.status(403).json({message: 'User is not authorized'});
    }
};

module.exports = checkAuthorizedMiddleware;