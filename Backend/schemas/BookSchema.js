const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    pdfFile: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'uploads.files'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = {BookSchema};