const express = require('express');
const router = express.Router();

const registroController = require('../controllers/registroController');

router.get('/registro', registroController.mostrarRegistro);
router.post('/registro', registroController.registrarUsuario);

router.get('/verificar/:token', registroController.verificarCuenta);

module.exports = router;