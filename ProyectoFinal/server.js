//Importamos librerías
const express = require('express');
const { engine } = require("express-handlebars");
const path = require('path');
const logger = require('./logger/index');
const env = require('./config/env.config');
const dbConfig = require('./db/config');
const passport = require('./middlewares/passport.middleware');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');
const yargs = require('yargs')(process.argv.slice(2));
const os = require('os');
const cluster = require('cluster');
const flash = require('connect-flash');
const { STATUS } = require('./utils/constants/api.constants');
const { apiFailedResponse } = require('./utils/api.utils');

//Para integrar Session con Mongo
const session = require('express-session');
const MongoStore = require('connect-mongo');

const ProductosServices = require('./services/productos/productos.services');
const productosServices = new ProductosServices();
const MensajesServices = require('./services/mensajes/mensajes.services');
const mensajesServices = new MensajesServices();

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
        ttl: +env.SESSION_TTL,
        //rolling: true,  //Para que el tiempo de expiración (maxAge) se refresque con cada request
        cookie: {
            maxAge: +env.SESSION_MAX_AGE
        }
    }));
    const upload = multer({ storage });

    //Para poder utilizar passport
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    //Importamos index del router
    const apiRoutes = require('./routers/app.routes');

    //Template engines
    app.engine('hbs', engine({
        //Objeto de configuración para el engine
        extname: 'hbs', //extension de la plantilla
        defaultLayout: path.resolve(__dirname, './public/hbs/layouts/main.hbs'), //en donde se define el layout inicial
        layoutDir: path.resolve(__dirname, './public/hbs/layouts') //ruta absoluta donde están las vistas principales
    }));
    app.set('views', './public');
    app.set('view engine', 'hbs');
    app.set('view engine', 'ejs');
    app.set('view engine', 'pug');

    // Routes
    app.use('/api', apiRoutes);

    //Ruta inicio
    app.get('/', async (req, res) => {
        const user = req.user;

        if (user) {
            if (user.email === env.EMAIL_ADMINISTRATOR) {
                res.render('./hbs/administradorMensajes.hbs', {
                    emailUsuario: user.email,
                    nombreUsuario: user.nombre,
                    direccionUsuario: user.direccion,
                    edadUsuario: user.edad,
                    nroTelefonoUsario: user.nroTelefono,
                    avatarUsuario: user.avatar
                });    
            } else {
                res.render('./hbs/form.hbs', {
                    emailUsuario: user.email,
                    nombreUsuario: user.nombre,
                    direccionUsuario: user.direccion,
                    edadUsuario: user.edad,
                    nroTelefonoUsario: user.nroTelefono,
                    avatarUsuario: user.avatar
                });
            }
        }
        else {
            res.redirect('/login');
        }
    });

    //Ruta para "Info del servidor"
    app.get('/infoServer', async (req, res) => {

        return res.render('pug/info.pug', 
          { pathEjecucion: process.execPath,
            nombrePlataforma: process.platform,
            processId: process.pid,
            versionNode: process.version,
            carpetaProyecto: process.cwd(),
            rss: process.memoryUsage().rss
          });
    });

    //Ruta para "Parámetros iniciales"
    app.get('/infoParametros', async (req, res) => {

        return res.render('hbs/info.hbs', 
          { nodeEnv: env.NODE_ENV,
            host: env.HOST,
            port: env.PORT,
            pers: env.PERS,
            emailAdministrador: env.EMAIL_ADMINISTRATOR,
            celAdministrador: env.CEL_ADMINISTRATOR,
            gmailFromSend: env.GMAIL_FROM_SEND,
            twilioAccountSid: env.TWILIO_ACCOUNT_SID,
            twilioAccountToken: env.TWILIO_ACCOUNT_TOKEN,
            twilioNumberWsp: env.TWILIO_NUMBER_WHATSAPP,
            twilioNumberSms: env.TWILIO_NUMBER_SMS,
            sessionTtl: env.SESSION_TTL,
            sessionMaxAge: env.SESSION_MAX_AGE
          });
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
                    logger.error(err);
                }
                else {
                    return res.render('./hbs/logout.hbs', { nombreUsuario: user?.email });
                }
            });
        }
        catch (err) {
            logger.error(err);
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

        return res.render('./ejs/error.ejs', { 
            textoError: 'Hubo un error al realizar "login":', 
            descripError: req.flash('loginFlashMessageError')[0] 
        });
    });

    //Register-error
    app.get('/register-error', (req, res) => {

        return res.render('./ejs/error.ejs', {
            textoError: 'Hubo un error al realizar "registro":',
            descripError: req.flash('registerFlashMessageError')[0]
        });
    });

    //Devuelve 404 cuando el método y la ruta no están implementados
    app.get('*', function (req, res) {
        const response = apiFailedResponse(`Método: ${req.method} y Ruta: ${req.originalUrl} no implementados`, STATUS.NOT_FOUND);
        return res.status(STATUS.NOT_FOUND).json(response);
    });
    app.post('*', function (req, res) {
        const response = apiFailedResponse(`Método: ${req.method} y Ruta: ${req.originalUrl} no implementados`, STATUS.NOT_FOUND);
        return res.status(STATUS.NOT_FOUND).json(response);
    });
    app.put('*', function (req, res) {
        const response = apiFailedResponse(`Método: ${req.method} y Ruta: ${req.originalUrl} no implementados`, STATUS.NOT_FOUND);
        return res.status(STATUS.NOT_FOUND).json(response);
    });
    app.delete('*', function (req, res) {
        const response = apiFailedResponse(`Método: ${req.method} y Ruta: ${req.originalUrl} no implementados`, STATUS.NOT_FOUND);
        return res.status(STATUS.NOT_FOUND).json(response);
    });

    //Creamos escuchador
    const connectedServer = httpServer.listen(env.PORT, () => {
        logger.info(`[${env.NODE_ENV.trim()}] Using "${env.PERS}" as project's data source`);
        logger.info(`[${env.NODE_ENV.trim()}] Server is up and running on port => ${env.PORT}`);
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
        let productos;
        try {
            productos = await productosServices.getProductosService();
        } catch (error) {
            logger.warn(`Error websocket: ${ error.message }`);
            productos = [];
        }
        socket.emit('actualiza-productos', productos);

        //Compartimos al nuevo cliente conectado los mensajes cargados
        let mensajesFiltradosPorUser;
        try {
            const mensajesTemp = await mensajesServices.getAllMensajesService();
            
            if (socket.handshake.query.emailUsuario === env.EMAIL_ADMINISTRATOR) {
                mensajesFiltradosPorUser = [...mensajesTemp];
            } else {
                mensajesFiltradosPorUser = mensajesTemp.filter(msj => msj.emailUsuario === socket.handshake.query.emailUsuario);
            }
        } catch (error) {
            logger.warn(`Error websocket: ${ error.message }`);
            mensajesFiltradosPorUser = [];
        }
        socket.emit('actualiza-mensajes', mensajesFiltradosPorUser);

        //Escuchamos cuando el cliente envía un nuevo mensaje
        socket.on('nuevo-mensaje', async (msj) => {
            try {
                await mensajesServices.createMensajeService(msj);
            } catch (error) {
                logger.warn(`Error websocket: ${ error.message }`);
            }

            //Actualizamos los mensajes a TODOS los clientes conectados
            let mensajesAll;
            try {
                mensajesAll = await mensajesServices.getAllMensajesService();
            } catch (error) {
                logger.warn(`Error websocket: ${ error.message }`);
                mensajesAll = [];
            }
            io.emit('actualiza-mensajes', mensajesAll);
        });

        //Escuchamos cuando el cliente se desconecta
        socket.on('disconnect', () => {
            logger.info(`Client has left! Id: ${socket.id}`);
        });
    });
}