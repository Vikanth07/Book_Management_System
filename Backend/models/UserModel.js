const {model} = require('mongoose');

const {UserSchema} = require('../schemas/UserSchema.js');

const UserModel = new model('User', UserSchema);

module.exports = {UserModel};