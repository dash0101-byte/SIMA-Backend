const express = require('express');
const router = express.Router();

const energiaController = require('../controllers/energiaController');

router.get('/', energiaController.obtenerEnergia);
router.post('/', energiaController.crearEnergia);

module.exports = router;