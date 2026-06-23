const Usuario = require('../models/Usuario');

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();

        res.status(201).json({
            mensaje: 'Usuario creado correctamente',
            usuario: nuevoUsuario
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear usuario', error });
    }
};