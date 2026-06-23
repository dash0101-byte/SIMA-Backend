const Energia = require('../models/Energia');

exports.obtenerEnergia = async (req, res) => {
    try {
        const energia = await Energia.find().sort({ fecha: -1 });
        res.json(energia);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener datos de energía',
            error
        });
    }
};

exports.crearEnergia = async (req, res) => {
    try {
        const nuevaEnergia = new Energia(req.body);
        await nuevaEnergia.save();

        res.status(201).json({
            mensaje: 'Datos de energía guardados correctamente',
            energia: nuevaEnergia
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al guardar datos de energía',
            error
        });
    }
};