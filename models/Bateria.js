const mongoose = require('mongoose');

const bateriaSchema = new mongoose.Schema({
    estado: {
        type: String,
        required: true
    },
    porcentaje: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bateria', bateriaSchema);
