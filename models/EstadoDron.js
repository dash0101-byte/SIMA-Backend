const mongoose = require('mongoose');

const estadoDronSchema = new mongoose.Schema({
    bateria: {
        type: Number,
        required: true
    },
    temperatura: {
        type: Number,
        required: true
    },
    magnetismo: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('EstadoDron', estadoDronSchema);