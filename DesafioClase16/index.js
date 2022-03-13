//Importamos librerías
const express = require('express');
const { engine } = require("express-handlebars");
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dbconfig = require('./db/config');
const { formatMessage } = require('./utils/utils')

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

//Importación de clase Contenedor
const ClaseContenedor = require('./data/Contenedor');
const contenedorProductos = new ClaseContenedor(dbconfig.mariaDB, 'productos');
const contenedorMensajes = new ClaseContenedor(dbconfig.sqlite, 'mensajes');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

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
app.use('', apiRoutes);

//Inicio
app.get('/', (req, res) => {
  res.render('form');
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

  //Compartimos al nuevo cliente conectado los productos cargados
  const productos = await contenedorProductos.getAll();
  socket.emit('actualiza-productos', productos);

  //Compartimos al nuevo cliente conectado los mensajes cargados
  const mensajes = await contenedorMensajes.getAll();
  socket.emit('actualiza-mensajes', mensajes);

  //Escuchamos cuando el cliente envía un nuevo producto
  socket.on('nuevo-producto', async (prod) => {
    await contenedorProductos.saveProduct(prod.title, +prod.price, prod.thumbnail);

    //Emitimos el mensaje recibido a TODOS los clientes (incluído el que lo envió)
    const productos = await contenedorProductos.getAll();
    io.emit('actualiza-productos', productos);
  });

  //Escuchamos cuando el cliente envía un nuevo mensaje
  socket.on('nuevo-mensaje', async (msj) => {
    await contenedorMensajes.saveMessage(formatMessage(msj.email, msj.mensaje));

    // //Emitimos el mensaje recibido a TODOS los clientes (incluído el que lo envió)
    const mensajes = await contenedorMensajes.getAll();
    io.emit('actualiza-mensajes', mensajes);
  });

  //Escuchamos cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log(`Client has left! Id: ${socket.id}`);
  });
});