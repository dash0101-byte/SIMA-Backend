const express = require('express');
const router = express.Router();

const estadoDronController = require('../controllers/estadoDronController');

router.get('/', estadoDronController.obtenerEstadosDron);
router.post('/', estadoDronController.crearEstadoDron);

module.exports = router;