//Importamos librerías
const express = require('express');
const { engine } = require("express-handlebars");
const path = require('path');
const logger = require('./logger/index');
const { ENV: { PORT } } = require('./config');
const env = require('./env.config');
const dbConfig = require('./db/config');
const passport = require('./middlewares/passport');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');
const yargs = require('yargs')(process.argv.slice(2));
const os = require('os');
const cluster = require('cluster');
//Para integrar Session con Mongo
const session = require('express-session');
const MongoStore = require('connect-mongo');

const { ProductosDao } = require('./models/daos/index');
const productosDao = new ProductosDao();

//Obtenemos parámetro recibido por línea de comando utilizando librería "yargs"
const args = yargs
    .default({
        MODE: 'FORK'
    })
    .alias({
        m: 'MODE'
    })
    .argv;

const MODE = args.MODE;
const CPU_NUMBERS = os.cpus().length;

if (MODE === 'CLUSTER' && cluster.isPrimary) {
    logger.info(`I am the primary process with pid ${process.pid}!`);
    logger.info(`Cores number => ${CPU_NUMBERS}`);

    for (let i = 0; i < CPU_NUMBERS; i++) {
        cluster.fork(); //para crear un proceso secundario
    }

    //Escuchamos cuando se detiene algún proceso y volvemos a levantar uno nuevo para seguir con 1 subproceso por núcleo
    cluster.on('exit', (worker, code) => {
        logger.info(`Worker ${worker.process.pid} died :(`)
        cluster.fork();
    });
}

if (!cluster.isPrimary || MODE === 'FORK') {
    const app = express();
    const httpServer = http.createServer(app);
    const io = socketIo(httpServer);

    //Configuración storage para Multer
    const storage = multer.diskStorage({
        destination: (req, file, cb) => { //req: objeto de la petición, file: archivo que se está cargando, cb: callback que maneja el proceso asíncrono
            cb(null, 'public/avatars') //param1: manejo de errores (lo dejo en null), param2: directorio donde almaceno mis archivos en el server
        },
        filename: (req, file, cb) => { //req: objeto de la petición, file: archivo que se está cargando, cb: callback que maneja el proceso asíncrono
            const extension = file.mimetype.split('/')[1];
            cb(null, `${req.body.username}.${extension}`);
        }
    });

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('./public'));
    app.use(session({
        name: 'session-proyecto-final-coder-pb', //nombre que le doy a la cookie que utiliza la session para identificarla (por defecto se genera una cookie "connect-id" o algo así...) 
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        //Defino el Store con Mongo
        store: MongoStore.create({
            mongoUrl: dbConfig.mongodb.connectTo('sesiones')
        }),
        ttl: 600,
        //rolling: true,  //Para que el tiempo de expiración (maxAge) se refresque con cada request
        cookie: {
            maxAge: 600000
        }
    }));
    const upload = multer({ storage });

    //Para poder utilizar passport
    app.use(passport.initialize());
    app.use(passport.session());

    //Importamos index del router
    const apiRoutes = require('./routers/index');

    //Template engines
    app.engine('hbs', engine({
        //Objeto de configuración para el engine
        extname: 'hbs', //extension de la plantilla
        defaultLayout: 'main.hbs', //en donde se define el layout inicial
        layoutDir: path.resolve(__dirname, './public/layouts') //ruta absoluta donde están las vistas principales
    }));
    app.set('views', './public');
    app.set('view engine', 'hbs');

    // Routes
    app.use('/api', apiRoutes);

    //Ruta inicio
    app.get('/', async (req, res) => {
        const user = req.user;

        if (user) {
            res.render('form', {
                emailUsuario: user.email,
                nombreUsuario: user.nombre,
                direccionUsuario: user.direccion,
                edadUsuario: user.edad,
                nroTelefonoUsario: user.nroTelefono,
                avatarUsuario: user.avatar
            });
        }
        else {
            res.redirect('/login');
        }
    });

    //Login GET
    app.get('/login', (req, res) => {
        return res.sendFile(__dirname + '/public/login.html');
    });

    //Login POST
    app.post(
        '/login',
        //Definimos la estrategia definida en middlewares/passport.js para el login
        passport.authenticate('login', { failureRedirect: '/login-error' }),
        async (_req, res, _next) => res.redirect('/')
    );

    //Logout
    app.post('/logout', async (req, res) => {
        try {
            const user = req.user;

            //El req.logOut() no elimina la cookie ni el registro de sesión en MongoDB
            //Se usa el session.destroy que realiza la eliminación ok 
            req.session.destroy(err => {
                res.clearCookie('session-proyecto-final-coder-pb'); //al eliminar la cookie, se eliminan todos los datos de la session. El nombre de la cookie es la que definí en el Middleware de la Session 
                if (err) {
                    console.log(err);
                }
                else {
                    return res.render('logout', { nombreUsuario: user.email });
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    });

    //Register GET
    app.get('/register', (req, res) => {

        return res.sendFile(__dirname + '/public/register.html');
    });

    //Register POST
    app.post(
        '/register',
        upload.single('avatar'),
        //Definimos la estrategia definida en middlewares/passport.js para el register
        passport.authenticate('register', { failureRedirect: '/register-error' }),
        async (_req, res, _next) => res.redirect('/')
    );

    //Login-error
    app.get('/login-error', (req, res) => {

        return res.render('error', { textoError: 'Hubo un error al realizar "login"' });
    });

    //Register-error
    app.get('/register-error', (req, res) => {

        return res.render('error', { textoError: 'Hubo un error al realizar "registro"' });
    });

    //Devuelve 404 cuando el método y la ruta no están implementados
    app.get('*', function (req, res) {
        return res.status(404).json({ error: -2, descripcion: `Método: ${req.method} y Ruta: ${req.originalUrl} no implementados` });
    });
    app.post('*', function (req, res) {
        return res.status(404).json({ error: -2, descripcion: `Método: ${req.method} y Ruta: ${req.originalUrl} no implementados` });
    });
    app.put('*', function (req, res) {
        return res.status(404).json({ error: -2, descripcion: `Método: ${req.method} y Ruta: ${req.originalUrl} no implementados` });
    });
    app.delete('*', function (req, res) {
        return res.status(404).json({ error: -2, descripcion: `Método: ${req.method} y Ruta: ${req.originalUrl} no implementados` });
    });

    //Creamos escuchador
    const connectedServer = httpServer.listen(PORT, () => {
        logger.info(`Server is up and running on port ${PORT}`);
    });

    //Definimos manejo de errores
    connectedServer.on('error', (error) => {
        logger.error('Error: ' + error);
    });

    //Sockets events
    io.on('connection', async (socket) => {
        //Eschuchamos cuando un nuevo cliente se conecta
        logger.info(`New client connection! Id: ${socket.id}`);

        // //Compartimos al nuevo cliente conectado los productos cargados
        const productos = await productosDao.getAll();
        socket.emit('actualiza-productos', productos);

        //Escuchamos cuando el cliente se desconecta
        socket.on('disconnect', () => {
            logger.info(`Client has left! Id: ${socket.id}`);
        });
    });
}