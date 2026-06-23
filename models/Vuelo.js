const mongoose = require('mongoose');

const vueloSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha_inicio: {
        type: Date,
        required: true
    },
    fecha_fin: {
        type: Date,
        default: null
    },
    ubicacion_inicio: {
        type: String,
        default: null
    },
    ubicacion_fin: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Vuelo', vueloSchema);