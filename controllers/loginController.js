const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');

const mostrarLogin = (req, res) => {
    res.render('login', {
        error: '',
        exito: ''
    });
};

const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', {
                error: 'Por favor completa todos los campos',
                exito: ''
            });
        }

        const usuario = await Usuario.findOne({
            correo: email
        });

        if (!usuario) {
            return res.render('login', {
                error: 'Usuario no encontrado',
                exito: ''
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.render('login', {
                error: 'Contraseña incorrecta',
                exito: ''
            });
        }

        req.session.usuario = {
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol || 'sin_verificar',
            verificado: usuario.verificado
        };

        req.session.save((error) => {
            if (error) {
                console.error('Error guardando sesión:', error);

                return res.render('login', {
                    error: 'Error al guardar la sesión',
                    exito: ''
                });
            }

            return res.redirect('/');
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        return res.render('login', {
            error: 'Error al iniciar sesión',
            exito: ''
        });
    }
};

const cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = {
    mostrarLogin,
    iniciarSesion,
    cerrarSesion
};