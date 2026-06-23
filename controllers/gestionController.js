const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const obtenerIdSesion = (req) => {
    if (!req.session.usuario) return null;

    return (
        req.session.usuario.id ||
        req.session.usuario._id ||
        null
    );
};

const esAdmin = (req) => {
    return req.session.usuario && req.session.usuario.rol === 'admin';
};

const mostrarGestion = async (req, res) => {
    try {
        if (!esAdmin(req)) {
            return res.redirect('/login');
        }

        const usuarioActual = req.session.usuario;
        const idActual = obtenerIdSesion(req);
        const usuarioEditarId = req.query.editar || null;

        let usuarioEditar = null;

        if (usuarioEditarId) {
            usuarioEditar = await Usuario.findById(usuarioEditarId);

            if (!usuarioEditar) {
                return res.redirect('/gestion?error=no_encontrado');
            }
        }

        const administradores = await Usuario.find({ rol: 'admin' })
            .sort({ fecha_registro: 1 });

        const usuarios = await Usuario.find({
            rol: { $in: ['cliente', 'vista_previa', 'sin_verificar'] }
        }).sort({ fecha_registro: 1 });

        res.render('gestion', {
            administradores,
            usuarios,
            usuarioEditar,
            error: req.query.error || '',

            usuario: usuarioActual || null,
            rol: usuarioActual.rol,
            logueado: true,
            puedeVerSistema: usuarioActual.rol !== 'sin_verificar',
            esAdmin: true,
            idActual: idActual ? idActual.toString() : ''
        });

    } catch (error) {
        console.error('Error al mostrar gestión:', error);
        res.redirect('/');
    }
};

const agregarUsuario = async (req, res) => {
    try {
        if (!esAdmin(req)) {
            return res.redirect('/login');
        }

        const { nombre, correo, password, rol } = req.body;

        if (!nombre || !correo || !password || !rol) {
            return res.redirect('/gestion?error=campos');
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const existe = await Usuario.findOne({ correo: correoNormalizado });

        if (existe) {
            return res.redirect('/gestion?error=correo');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            nombre: nombre.trim(),
            correo: correoNormalizado,
            password: passwordHash,
            rol
        });

        await nuevoUsuario.save();

        res.redirect('/gestion');

    } catch (error) {
        console.error('Error al agregar usuario:', error);
        res.redirect('/gestion?error=general');
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        if (!esAdmin(req)) {
            return res.redirect('/login');
        }

        const { id, nombre, correo, password, rol } = req.body;
        const idActual = obtenerIdSesion(req);

        if (!id || !nombre || !correo || !rol) {
            return res.redirect('/gestion?error=campos');
        }

        if (!idActual) {
            return res.redirect('/login');
        }

        if (id === idActual.toString() && rol !== 'admin') {
            return res.redirect('/gestion?error=protegido');
        }

        const usuarioExiste = await Usuario.findById(id);

        if (!usuarioExiste) {
            return res.redirect('/gestion?error=no_encontrado');
        }

        const correoNormalizado = correo.trim().toLowerCase();

        const correoEnUso = await Usuario.findOne({
            correo: correoNormalizado,
            _id: { $ne: id }
        });

        if (correoEnUso) {
            return res.redirect('/gestion?error=correo');
        }

        const datosActualizar = {
            nombre: nombre.trim(),
            correo: correoNormalizado,
            rol
        };

        if (password && password.trim() !== '') {
            datosActualizar.password = await bcrypt.hash(password, 10);
        }

        await Usuario.findByIdAndUpdate(id, datosActualizar, {
            runValidators: true
        });

        if (id === idActual.toString()) {
            req.session.usuario = {
                ...req.session.usuario,
                id: id,
                _id: id,
                nombre: nombre.trim(),
                correo: correoNormalizado,
                rol
            };
        }

        res.redirect('/gestion');

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.redirect('/gestion?error=general');
    }
};

const hacerAdmin = async (req, res) => {
    try {
        if (!esAdmin(req)) {
            return res.redirect('/login');
        }

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.redirect('/gestion?error=no_encontrado');
        }

        await Usuario.findByIdAndUpdate(req.params.id, {
            rol: 'admin'
        });

        res.redirect('/gestion');

    } catch (error) {
        console.error('Error al hacer admin:', error);
        res.redirect('/gestion?error=general');
    }
};

const quitarAdmin = async (req, res) => {
    try {
        if (!esAdmin(req)) {
            return res.redirect('/login');
        }

        const idActual = obtenerIdSesion(req);

        if (!idActual) {
            return res.redirect('/login');
        }

        if (req.params.id === idActual.toString()) {
            return res.redirect('/gestion?error=protegido');
        }

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.redirect('/gestion?error=no_encontrado');
        }

        await Usuario.findByIdAndUpdate(req.params.id, {
            rol: 'cliente'
        });

        res.redirect('/gestion');

    } catch (error) {
        console.error('Error al quitar admin:', error);
        res.redirect('/gestion?error=general');
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        if (!esAdmin(req)) {
            return res.redirect('/login');
        }

        const idActual = obtenerIdSesion(req);

        if (!idActual) {
            return res.redirect('/login');
        }

        if (req.params.id === idActual.toString()) {
            return res.redirect('/gestion?error=protegido');
        }

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.redirect('/gestion?error=no_encontrado');
        }

        await Usuario.findByIdAndDelete(req.params.id);

        res.redirect('/gestion');

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.redirect('/gestion?error=general');
    }
};

module.exports = {
    mostrarGestion,
    agregarUsuario,
    actualizarUsuario,
    hacerAdmin,
    quitarAdmin,
    eliminarUsuario
};