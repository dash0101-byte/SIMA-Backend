const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    bateria: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    temperatura: {
        type: Number,
        required: true
    },
    estacion: {
        type: String,
        required: true
    },
    gps: {
        type: String,
        required: true
    },
    altura: {
        type: Number,
        required: true
    },
    co2: {
        type: Number,
        required: true
    },
    humedad: {
        type: Number,
        required: true
    },
    presion: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sensor', sensorSchema);