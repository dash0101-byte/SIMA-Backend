const Comentario = require('../models/Comentario');

exports.obtenerComentarios = async (req, res) => {
    try {
        const comentarios = await Comentario.find()
            .populate('usuario_id', 'nombre correo rol')
            .sort({ fecha: -1 });

        res.json(comentarios);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener comentarios',
            error: error.message
        });
    }
};

exports.crearComentario = async (req, res) => {
    try {
        const { usuario_id, comentario } = req.body;

        if (!usuario_id || !comentario) {
            return res.status(400).json({
                mensaje: 'usuario_id y comentario son obligatorios'
            });
        }

        const nuevoComentario = new Comentario({
            usuario_id,
            comentario
        });

        await nuevoComentario.save();

        res.status(201).json({
            mensaje: 'Comentario creado correctamente',
            comentario: nuevoComentario
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear comentario',
            error: error.message
        });
    }
};