const express = require('express');
const router = express.Router();

const bateriaController = require('../controllers/bateriaController');

router.get('/', bateriaController.obtenerBaterias);

router.post('/', bateriaController.crearBateria);

module.exports = router;