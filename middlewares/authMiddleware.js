function requiereLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }

    next();
}

function soloAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }

    if (req.session.usuario.rol !== 'admin') {
        return res.redirect('/');
    }

    next();
}

function clienteOAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }

    if (
        req.session.usuario.rol !== 'cliente' &&
        req.session.usuario.rol !== 'admin'
    ) {
        return res.redirect('/');
    }

    next();
}

function vistaClienteAdmin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect('/login');
    }

    if (
        req.session.usuario.rol !== 'vista_previa' &&
        req.session.usuario.rol !== 'cliente' &&
        req.session.usuario.rol !== 'admin'
    ) {
        return res.redirect('/');
    }

    next();
}

module.exports = {
    requiereLogin,
    soloAdmin,
    clienteOAdmin,
    vistaClienteAdmin
};