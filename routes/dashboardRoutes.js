const express = require('express');

const router = express.Router();

const {
    clienteOAdmin
} = require('../middlewares/authMiddleware');

router.get('/dashboard', clienteOAdmin, (req, res) => {
    res.render('dashboard');
});

module.exports = router;