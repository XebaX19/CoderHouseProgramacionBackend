//Importamos librerías
const express = require('express');
const { engine } = require("express-handlebars");
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dbConfig = require('./db/config');
const { formatMessage } = require('./utils/utils');
const { generateRandomArrayProducts } = require('./utils/faker');
const { normalizedMensajes } = require('./utils/normalizr');
const util = require('util');
const env = require('./env.config');
//Para integrar Session con Mongo
const session = require('express-session');
const MongoStore = require('connect-mongo');

const PORT = env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const nombreArchivo = "mensajesNuevoFormato.txt";

//Importación de clase Contenedor
const ClaseContenedorSQL = require('./data/ContenedorSQL');
const contenedorProductos = new ClaseContenedorSQL(dbConfig.mariaDB, 'productos');
const ClaseContenedorFileSystem = require('./data/ContenedorFileSystem');
const contenedorMensajes = new ClaseContenedorFileSystem(nombreArchivo);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(session({
  name: 'session-desafio-24', //nombre que le doy a la cookie que utiliza la session para identificarla (por defecto se genera una cookie "connect-id" o algo así...) 
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  //Defino el Store con Mongo
  store: MongoStore.create({
    mongoUrl: dbConfig.mongodb.connectTo('sesiones')
  }),
  rolling: true,  //Para que el tiempo de expiración (maxAge) se refresque con cada request
  cookie: {
    maxAge: 60000
  }
}));

//Importamos index del router
const apiRoutes = require('./routers/index')

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

//Inicio
app.get('/', async (req, res) => {
  const user = await req.session.user;
  if (user) {
    res.redirect('/api/productos-test');
  }
  else {
    return res.sendFile(__dirname + '/public/login.html');
  }
});

//Login
app.post('/login', (req, res) => {
  const { nombreUsuario, password } = req.body;

  if (!nombreUsuario) return res.sendFile(__dirname + '/public/error.html');

  req.session.user = nombreUsuario;
  req.session.save((err) => {
    //Esto se ejecuta luego de guardarse el objeto en la session
    if (err) {
      console.log('Error en session => ', err);
      res.redirect('/');
    }

    res.redirect('/api/productos-test');
  });
});

//Logout
app.post('/logout', async (req, res) => {
  try {
    const user = await req.session.user;

    req.session.destroy(err => {
      res.clearCookie('session-desafio-24'); //al eliminar la cookie, se eliminan todos los datos de la session. El nombre de la cookie es la que definí en el Middleware de la Session 
      if (err) {
        console.log(err);
      }
      else {
        return res.render('logout', {nombreUsuario: user});
      }
    })
  }
  catch (err) {
    console.log(err);
  }
});

//Creamos escuchador
const connectedServer = httpServer.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

//Definimos manejo de errores
connectedServer.on('error', (error) => {
  console.error('Error: ', error);
});

//Sockets events
io.on('connection', async (socket) => {
  console.log(`New client connection! Id: ${socket.id}`);

  // //Compartimos al nuevo cliente conectado los productos cargados
  // const productos = await contenedorProductos.getAll();
  // socket.emit('actualiza-productos', productos);

  //Compartimos al nuevo cliente conectado los productos Fakers
  const productosFaker = generateRandomArrayProducts(5);
  socket.emit('actualiza-productos', productosFaker);

  //Compartimos al nuevo cliente conectado los mensajes cargados
  const mensajes = await contenedorMensajes.getAll();
  const mensajesConId = {
    id: 'mensajes',
    mensajes
  };
  const mensajesNormalizado = normalizedMensajes(mensajesConId);
  socket.emit('actualiza-mensajes', mensajesNormalizado);

  //Escuchamos cuando el cliente envía un nuevo producto
  socket.on('nuevo-producto', async (prod) => {
    //await contenedorProductos.saveProduct(prod.title, +prod.price, prod.thumbnail);

    //Emitimos el mensaje recibido a TODOS los clientes (incluído el que lo envió)
    //const productos = await contenedorProductos.getAll();
    //io.emit('actualiza-productos', productos);
  });

  //Escuchamos cuando el cliente envía un nuevo mensaje
  socket.on('nuevo-mensaje', async (msj) => {
    await contenedorMensajes.save(msj)

    // //Emitimos el mensaje recibido a TODOS los clientes (incluído el que lo envió)
    const mensajes = await contenedorMensajes.getAll();
    const mensajesConId = {
      id: 'mensajes',
      mensajes
    };
    const mensajesNormalizado = normalizedMensajes(mensajesConId);
    io.emit('actualiza-mensajes', mensajesNormalizado);
  });

  //Escuchamos cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log(`Client has left! Id: ${socket.id}`);
  });
});