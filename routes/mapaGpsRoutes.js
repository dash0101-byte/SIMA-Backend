const express = require('express');
const router = express.Router();

router.get('/mapa-gps', (req, res) => {
    const usuario = req.session.usuario || null;

    res.render('mapa_gps', {
        usuario,
        rol: usuario ? usuario.rol : '',
        logueado: !!usuario,
        puedeVerSistema: usuario
            ? usuario.rol !== 'sin_verificar'
            : false,
        esAdmin: usuario
            ? usuario.rol === 'admin'
            : false
    });
});

module.exports = router;