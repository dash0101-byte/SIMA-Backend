const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Usuario = require('../models/Usuario');
const transporter = require('../config/mailer');

const mostrarRegistro = (req, res) => {
    res.render('registro', {
        error: '',
        exito: ''
    });
};

const registrarUsuario = async (req, res) => {
    try {
        const {
            nombre,
            email,
            password,
            confirmarPassword,
            pregunta,
            respuesta
        } = req.body;

        if (!nombre || !email || !password || !confirmarPassword || !pregunta || !respuesta) {
            return res.render('registro', {
                error: 'Todos los campos son obligatorios',
                exito: ''
            });
        }

        if (password !== confirmarPassword) {
            return res.render('registro', {
                error: 'Las contraseñas no coinciden',
                exito: ''
            });
        }

        const usuarioExistente = await Usuario.findOne({
            correo: email
        });

        if (usuarioExistente) {
            return res.render('registro', {
                error: 'Este correo ya está registrado',
                exito: ''
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const respuestaHash = await bcrypt.hash(respuesta, 10);
        const token = crypto.randomBytes(32).toString('hex');

        const nuevoUsuario = new Usuario({
            nombre,
            correo: email,
            password: passwordHash,
            rol: 'vista_previa',
            pregunta_secreta: pregunta,
            respuesta_secreta: respuestaHash,
            verificado: false,
            token_verificacion: token
        });

        await nuevoUsuario.save();

        const linkVerificacion = `${process.env.APP_URL}/verificar/${token}`;

        await transporter.sendMail({
            from: `"SIMA" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verifica tu cuenta en SIMA',
            html: `
                <h2>Hola ${nombre}</h2>
                <p>Gracias por registrarte en SIMA.</p>
                <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
                <p>
                    <a href="${linkVerificacion}">
                        Verificar cuenta
                    </a>
                </p>
                <p>Si tú no creaste esta cuenta, ignora este correo.</p>
            `
        });

        res.render('registro', {
            error: '',
            exito: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.'
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);

        res.render('registro', {
            error: 'Error al registrar usuario o enviar correo de verificación',
            exito: ''
        });
    }
};

const verificarCuenta = async (req, res) => {
    try {
        const { token } = req.params;

        const usuario = await Usuario.findOne({
            token_verificacion: token
        });

        if (!usuario) {
            return res.render('login', {
                error: 'Token inválido o cuenta ya verificada',
                exito: ''
            });
        }

        usuario.verificado = true;
        usuario.token_verificacion = null;

        await usuario.save();

        res.render('login', {
            error: '',
            exito: 'Cuenta verificada correctamente. Ahora puedes iniciar sesión.'
        });

    } catch (error) {
        console.error('Error al verificar cuenta:', error);

        res.render('login', {
            error: 'Error al verificar cuenta',
            exito: ''
        });
    }
};

module.exports = {
    mostrarRegistro,
    registrarUsuario,
    verificarCuenta
};