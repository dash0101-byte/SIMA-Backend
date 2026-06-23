const express = require('express');

const router = express.Router();

const {
    mostrarForgotPassword,
    enviarTokenPassword,
    mostrarResetPassword,
    actualizarPassword
} = require('../controllers/forgotPasswordController');

router.get(
    '/forgot-password',
    mostrarForgotPassword
);

router.post(
    '/forgot-password',
    enviarTokenPassword
);

router.get(
    '/reset-password/:token',
    mostrarResetPassword
);

router.post(
    '/reset-password/:token',
    actualizarPassword
);

module.exports = router;