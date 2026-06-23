const express = require('express');
const router = express.Router();

const sensorController = require('../controllers/sensorController');

router.get('/', sensorController.obtenerSensores);
router.post('/', sensorController.crearSensor);

module.exports = router;