const jwt = require("jsonwebtoken");
const {secret} = require("../config");
function generateAccessToken (username, role){
    const payload = {
        username,
        role
    }
    return jwt.sign(payload, secret, {expiresIn:60 * 60 * 1000})
}
module.exports = {generateAccessToken}