const {model} = require('mongoose');

const {BookSchema} = require('../schemas/BookSchema.js');

const BookModel = new model('Book', BookSchema);

module.exports = {BookModel};