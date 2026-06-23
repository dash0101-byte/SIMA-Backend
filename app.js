const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');

const conectarDB = require('./config/database');

// Rutas API
const usuarioRoutes = require('./routes/usuarioRoutes');
const vueloRoutes = require('./routes/vueloRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const estadoDronRoutes = require('./routes/estadoDronRoutes');
const energiaRoutes = require('./routes/energiaRoutes');
const bateriaRoutes = require('./routes/bateriaRoutes');

// Rutas WEB
const indexRoutes = require('./routes/indexRoutes');
const comentariosVistaRoutes = require('./routes/comentariosVistaRoutes');
const loginRoutes = require('./routes/loginRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const registroRoutes = require('./routes/registroRoutes');
const gestionRoutes = require('./routes/gestionRoutes');
const mapaGpsRoutes = require('./routes/mapaGpsRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');

dotenv.config();

const app = express();

// Conexión MongoDB
conectarDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
    secret: 'sima_secreto_temporal',
    resave: false,
    saveUninitialized: false
}));

// Variables disponibles en todas las vistas EJS
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;

    res.locals.id_usuario = req.session.usuario
        ? req.session.usuario.id
        : null;

    res.locals.rol = req.session.usuario
        ? req.session.usuario.rol
        : null;

    res.locals.logueado = !!req.session.usuario;

    res.locals.puedeVerSistema =
        res.locals.rol === 'vista_previa' ||
        res.locals.rol === 'cliente' ||
        res.locals.rol === 'admin';

    res.locals.esAdmin = res.locals.rol === 'admin';

    next();
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

// ======================
// RUTAS WEB
// ======================

app.use('/', indexRoutes);
app.use('/', comentariosVistaRoutes);
app.use('/', loginRoutes);
app.use('/', dashboardRoutes);
app.use('/', registroRoutes);
app.use('/', gestionRoutes);
app.use('/', mapaGpsRoutes);
app.use('/', forgotPasswordRoutes);

// ======================
// RUTAS API
// ======================

app.use('/usuarios', usuarioRoutes);
app.use('/vuelos', vueloRoutes);
app.use('/comentarios', comentarioRoutes);
app.use('/sensores', sensorRoutes);
app.use('/estado-dron', estadoDronRoutes);
app.use('/energia', energiaRoutes);
app.use('/baterias', bateriaRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚁 SIMA ejecutándose en http://localhost:${PORT}`);
});