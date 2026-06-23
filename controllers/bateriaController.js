const Bateria = require('../models/Bateria');

exports.obtenerBaterias = async (req, res) => {
    try {
        const baterias = await Bateria.find().sort({ fecha: -1 });
        res.json(baterias);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener baterías',
            error
        });
    }
};

exports.crearBateria = async (req, res) => {
    try {
        const nuevaBateria = new Bateria(req.body);

        await nuevaBateria.save();

        res.status(201).json({
            mensaje: 'Batería creada correctamente',
            bateria: nuevaBateria
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear batería',
            error
        });
    }
};