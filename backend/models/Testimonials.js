const mongoose = require('mongoose');
const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Testimonials', testimonialSchema);