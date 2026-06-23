const Comentario = require('../models/Comentario');

const obtenerRolClase = (rol) => {
    if (rol === 'admin') return 'rol-admin';
    if (rol === 'cliente') return 'rol-cliente';
    if (rol === 'cliente_final') return 'rol-cliente';
    return 'rol-vista_previa';
};

const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';

    return new Date(fecha).toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const mostrarComentarios = async (req, res) => {
    try {
        const usuario = req.session.usuario || null;

        const comentariosDB = await Comentario.find()
            .populate('usuario_id', 'nombre rol')
            .sort({ fecha: -1 });

        const comentarios = comentariosDB.map(item => ({
            comentario: item.comentario || '',
            fechaFormateada: formatearFecha(item.fecha),
            nombreUsuario: item.usuario_id?.nombre || 'Usuario',
            rol: item.usuario_id?.rol || 'vista_previa',
            rolClase: obtenerRolClase(item.usuario_id?.rol)
        }));

        res.render('comentarios', {
            comentarios,
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
        console.error('Error al mostrar comentarios:', error);

        const usuario = req.session.usuario || null;

        res.render('comentarios', {
            comentarios: [],
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

module.exports = {
    mostrarComentarios
};