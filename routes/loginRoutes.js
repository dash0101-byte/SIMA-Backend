const express = require('express');

const router = express.Router();

const loginController = require('../controllers/loginController');

router.get('/login', loginController.mostrarLogin);

router.post('/login', loginController.iniciarSesion);

router.get('/logout', loginController.cerrarSesion);

module.exports = router;