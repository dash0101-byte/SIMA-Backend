const Vuelo = require('../models/Vuelo');

exports.obtenerVuelos = async (req, res) => {
    try {
        const vuelos = await Vuelo.find()
            .populate('usuario_id', 'nombre correo')
            .sort({ fecha_inicio: -1 });

        res.json(vuelos);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener vuelos',
            error
        });
    }
};

exports.crearVuelo = async (req, res) => {
    try {
        const nuevoVuelo = new Vuelo(req.body);

        await nuevoVuelo.save();

        res.status(201).json({
            mensaje: 'Vuelo creado correctamente',
            vuelo: nuevoVuelo
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear vuelo',
            error
        });
    }
};

exports.mostrarVistaVuelos = async (req, res) => {
    try {
        const usuario = req.session.usuario || null;

        const vuelos = await Vuelo.find()
            .populate('usuario_id', 'nombre correo')
            .sort({ fecha_inicio: -1 });

        res.render('vuelos', {
            vuelos,
            usuario,
            rol: usuario ? usuario.rol : '',
            logueado: !!usuario,
            puedeVerSistema: usuario
                ? usuario.rol !== 'sin_verificar'
                : false,
            esAdmin: usuario
                ? usuario.rol === 'admin'
                : false
        });

    } catch (error) {
        console.error('Error al mostrar vista de vuelos:', error);

        const usuario = req.session.usuario || null;

        res.render('vuelos', {
            vuelos: [],
            usuario,
            rol: usuario ? usuario.rol : '',
            logueado: !!usuario,
            puedeVerSistema: usuario
                ? usuario.rol !== 'sin_verificar'
                : false,
            esAdmin: usuario
                ? usuario.rol === 'admin'
                : false
        });
    }
};