const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String
    },

    rol: {
        type: String,
        enum: [
            'sin_verificar',
            'vista_previa',
            'cliente',
            'admin'
        ],
        default: 'sin_verificar'
    },

    fecha_registro: {
        type: Date,
        default: Date.now
    },

    reset_token: {
        type: String,
        default: null
    },

    reset_token_expires: {
        type: Date,
        default: null
    },

    verificado: {
        type: Boolean,
        default: false
    },

    token_verificacion: {
        type: String,
        default: null
    }

});

module.exports = mongoose.model('Usuario', usuarioSchema);