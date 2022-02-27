//Importamos librerías
const express = require('express');
const { engine } = require("express-handlebars");
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const { formatMessage } = require('./utils/utils')

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
const nombreArchivo = "mensajesGuardados.txt";

//Importación de clase Products
const ClaseProductos = require('./data/Products');
const productos = new ClaseProductos();

//Recupera mensajes cargados en archivo
const obtieneMensajesDeArchivo = async () => {
  let mensajesTxt = '';
  let arrayMensajes = [];

  try {
    mensajesTxt = await fs.promises.readFile(`./data/${nombreArchivo}`, 'utf-8');
  } catch (error) {
    //Si entra al catch porque no exist el archivo, no muestro error...se va a crear al guardar
    //Sólo muestro el error si se debe a otro problema
    if (error.code != 'ENOENT') {
      console.log(error);
    }
  }

  if (mensajesTxt.length > 0 && mensajesTxt != '[]') {
    arrayMensajes = JSON.parse(mensajesTxt);
  }

  return arrayMensajes;
};

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
io.on('connection', (socket) => {
  console.log(`New client connection! Id: ${socket.id}`);

  //Compartimos al nuevo cliente conectado los productos cargados
  socket.emit('actualiza-productos', [...productos.getAll()]);

  //Compartimos al nuevo cliente conectado los mensajes cargados
  obtieneMensajesDeArchivo().then(mensajes => socket.emit('actualiza-mensajes', [...mensajes]));

  //Escuchamos cuando el cliente envía un nuevo producto
  socket.on('nuevo-producto', (prod) => {
    productos.save(prod.title, +prod.price, prod.thumbnail);

    //Emitimos el mensaje recibido a TODOS los clientes (incluído el que lo envió)
    io.emit('actualiza-productos', [...productos.getAll()]);
  });

  //Escuchamos cuando el cliente envía un nuevo mensaje
  socket.on('nuevo-mensaje', async (msj) => {
    let arrayMensajes = [];
    try {

      arrayMensajes = obtieneMensajesDeArchivo()
        .then(async resultado => {
          resultado.push(formatMessage(msj.email, msj.mensaje));

          // //Emitimos el mensaje recibido a TODOS los clientes (incluído el que lo envió)
          io.emit('actualiza-mensajes', [...resultado]);

          //Actualizamos el archivo con el nuevo mensaje
          await fs.promises.writeFile(`./data/${nombreArchivo}`, JSON.stringify(resultado, null, 2));
        });
    } catch (err) {
      console.log(`Hubo un error al guardar el mensaje: ${err.message}`);
    }
  });

  //Escuchamos cuando el cliente se desconecta
  socket.on('disconnect', () => {
    console.log(`Client has left! Id: ${socket.id}`);
  });
});