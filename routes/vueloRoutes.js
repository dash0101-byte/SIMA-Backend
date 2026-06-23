const express = require('express');
const router = express.Router();

const vueloController = require('../controllers/vueloController');

router.get('/vista', vueloController.mostrarVistaVuelos);

router.get('/', vueloController.obtenerVuelos);

router.post('/', vueloController.crearVuelo);

module.exports = router;