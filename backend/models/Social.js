const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
    instagram:{
        type: String,
        required: true
    },
    facebook:{
        type: String,
        required: true
    },
    twitter:{
        type: String,
        required: true
    },
    whatsapp: {
        type: String,
        required: true
    }
    
}, {timestamps:true});

module.exports = mongoose.model('Social', socialSchema);