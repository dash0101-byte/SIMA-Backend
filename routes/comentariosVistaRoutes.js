const express = require('express');
const router = express.Router();

const comentariosVistaController = require('../controllers/comentariosVistaController');

router.get('/comentarios-vista', comentariosVistaController.mostrarComentarios);

module.exports = router;