const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const transporter = require('../config/mailer');

const mostrarForgotPassword = (req, res) => {
    res.render('forgot-password', {
        error: '',
        exito: ''
    });
};

const enviarTokenPassword = async (req, res) => {
    try {
        const { correo } = req.body;

        if (!correo) {
            return res.render('forgot-password', {
                error: 'Ingresa tu correo electrónico',
                exito: ''
            });
        }

        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.render('forgot-password', {
                error: 'No existe una cuenta registrada con ese correo',
                exito: ''
            });
        }

        const token = crypto.randomBytes(32).toString('hex');

        usuario.reset_token = token;
        usuario.reset_token_expires = Date.now() + 1000 * 60 * 30;

        await usuario.save();

        const enlace = `http://localhost:3000/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: usuario.correo,
            subject: 'Recuperación de contraseña - SIMA',
            html: `
                <h2>Recuperación de contraseña</h2>

                <p>Hola ${usuario.nombre},</p>

                <p>Solicitaste restablecer tu contraseña.</p>

                <p>Da clic en el siguiente enlace:</p>

                <a href="${enlace}">
                    ${enlace}
                </a>

                <p>Este enlace expirará en 30 minutos.</p>

                <p>Si no solicitaste este cambio, ignora este correo.</p>
            `
        });

        return res.render('forgot-password', {
            error: '',
            exito: 'Se envió un enlace de recuperación a tu correo'
        });

    } catch (error) {
        console.error('Error al enviar token de recuperación:', error);

        return res.render('forgot-password', {
            error: 'Ocurrió un error al enviar el correo de recuperación',
            exito: ''
        });
    }
};

const mostrarResetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const usuario = await Usuario.findOne({
            reset_token: token,
            reset_token_expires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.render('reset-password', {
                error: 'El enlace no es válido o ya expiró',
                exito: '',
                token: ''
            });
        }

        return res.render('reset-password', {
            error: '',
            exito: '',
            token
        });

    } catch (error) {
        console.error('Error al mostrar reset password:', error);

        return res.render('reset-password', {
            error: 'Ocurrió un error al validar el enlace',
            exito: '',
            token: ''
        });
    }
};

const actualizarPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmarPassword } = req.body;

        if (!password || !confirmarPassword) {
            return res.render('reset-password', {
                error: 'Todos los campos son obligatorios',
                exito: '',
                token
            });
        }

        if (password !== confirmarPassword) {
            return res.render('reset-password', {
                error: 'Las contraseñas no coinciden',
                exito: '',
                token
            });
        }

        if (password.length < 6) {
            return res.render('reset-password', {
                error: 'La contraseña debe tener al menos 6 caracteres',
                exito: '',
                token
            });
        }

        const usuario = await Usuario.findOne({
            reset_token: token,
            reset_token_expires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.render('reset-password', {
                error: 'El enlace no es válido o ya expiró',
                exito: '',
                token: ''
            });
        }

        const mismaPassword = await bcrypt.compare(password, usuario.password);

        if (mismaPassword) {
            return res.render('reset-password', {
                error: 'Debes usar una contraseña diferente a la anterior',
                exito: '',
                token
            });
        }

        const passwordEncriptada = await bcrypt.hash(password, 10);

        usuario.password = passwordEncriptada;
        usuario.reset_token = null;
        usuario.reset_token_expires = null;

        await usuario.save();

        return res.render('reset-password', {
            error: '',
            exito: 'Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.',
            token: ''
        });

    } catch (error) {
        console.error('Error al actualizar contraseña:', error);

        return res.render('reset-password', {
            error: 'Ocurrió un error al actualizar la contraseña',
            exito: '',
            token: req.params.token || ''
        });
    }
};

module.exports = {
    mostrarForgotPassword,
    enviarTokenPassword,
    mostrarResetPassword,
    actualizarPassword
};