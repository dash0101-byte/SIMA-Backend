const express = require('express');
const router = express.Router();

const gestionController = require('../controllers/gestionController');

const {
    requiereLogin,
    soloAdmin
} = require('../middlewares/authMiddleware');

router.get('/gestion', requiereLogin, soloAdmin, gestionController.mostrarGestion);

router.post('/gestion/agregar', requiereLogin, soloAdmin, gestionController.agregarUsuario);

router.post('/gestion/actualizar', requiereLogin, soloAdmin, gestionController.actualizarUsuario);

router.post('/gestion/hacer-admin/:id', requiereLogin, soloAdmin, gestionController.hacerAdmin);

router.post('/gestion/quitar-admin/:id', requiereLogin, soloAdmin, gestionController.quitarAdmin);

router.post('/gestion/eliminar/:id', requiereLogin, soloAdmin, gestionController.eliminarUsuario);

module.exports = router;