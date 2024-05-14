const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    role: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    balance: { type: Number, required: true },
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;