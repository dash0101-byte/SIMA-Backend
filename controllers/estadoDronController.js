const EstadoDron = require('../models/EstadoDron');

exports.obtenerEstadosDron = async (req, res) => {
    try {
        const estados = await EstadoDron.find().sort({ fecha: -1 });
        res.json(estados);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener estados del dron',
            error
        });
    }
};

exports.crearEstadoDron = async (req, res) => {
    try {
        const nuevoEstado = new EstadoDron(req.body);
        await nuevoEstado.save();

        res.status(201).json({
            mensaje: 'Estado del dron guardado correctamente',
            estado: nuevoEstado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al guardar estado del dron',
            error
        });
    }
};