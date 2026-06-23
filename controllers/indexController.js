const mostrarIndex = (req, res) => {

    const usuario = req.session.usuario || null;

    res.render('index', {

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

};

module.exports = {
    mostrarIndex
};