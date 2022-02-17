//Importamos librerías
const express = require('express');
const {engine} = require("express-handlebars");
const path = require('path');

const PORT = process.env.PORT || 8080;
const app = express();

//Importamos index del router
const apiRoutes = require('./routers/index')

// Middlewares
app.use(express.static('views')); 

//Template engines
app.engine('hbs', engine({
  //Objeto de configuración para el engine
  extname: 'hbs', //extension de la plantilla
  defaultLayout: 'main.hbs', //en donde se define el layout inicial
  layoutDir: path.resolve(__dirname, './views/layouts') //ruta absoluta donde están las vistas principales
}));
app.set('views', './views');
app.set('view engine', 'hbs');

// Routes
app.use('', apiRoutes);

//Inicio
app.get('/', (req, res) => {
  res.render('form');
});

//Creamos escuchador
const connectedServer = app.listen(PORT, ()=> {
  console.log(`Server is up and running on port ${PORT}`);
});

//Definimos manejo de errores
connectedServer.on('error', (error) => {
  console.error('Error: ', error);
})
