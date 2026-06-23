const Sensor = require('../models/Sensor');

exports.obtenerSensores = async (req, res) => {
    try {
        const ultimoSensor = await Sensor.findOne().sort({ fecha: -1 });

        if (!ultimoSensor) {
            return res.json({
                bateria: 0,
                estado: 'Desconocido',
                temperatura: 0,
                estacion: '-',
                gps: 'Inactivo',
                altura: 0,
                co2: 0,
                humedad: 0,
                presion: 0
            });
        }

        res.json(ultimoSensor);

    } catch (error) {
        console.error('Error al obtener el último sensor:', error);
        res.status(500).json({
            mensaje: 'Error al obtener el último sensor'
        });
    }
};

exports.crearSensor = async (req, res) => {
    try {
        const nuevoSensor = new Sensor(req.body);
        await nuevoSensor.save();

        res.status(201).json({
            mensaje: 'Sensor guardado correctamente',
            sensor: nuevoSensor
        });

    } catch (error) {
        console.error('Error al guardar sensor:', error);

        res.status(500).json({
            mensaje: 'Error al guardar sensor'
        });
    }
};