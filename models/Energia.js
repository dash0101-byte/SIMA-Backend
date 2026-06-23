const mongoose = require('mongoose');

const energiaSchema = new mongoose.Schema({
    panel_solar: {
        type: Number,
        required: true
    },
    consumo_dron: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Energia', energiaSchema);
