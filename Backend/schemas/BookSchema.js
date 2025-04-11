const {Schema} = require('mongoose');
const mongoose = require('mongoose');
const BookSchema = new Schema({
    title: { type: String, required: true },
    pdfFile: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = {BookSchema};