const mongoose = require('mongoose')

const Upload = new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    password: String,
    downloads: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Upload', Upload)