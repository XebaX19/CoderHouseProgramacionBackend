//Importamos librerías
const express = require('express');

const PORT = process.env.PORT || 8080;
const app = express();

//Importamos index del router
const apiRoutes = require('./routers/index')

// Middlewares
app.use(express.static('views')); 

//Template engines
app.set('views', './views');
app.set('view engine', 'ejs');

// Routes
app.use('', apiRoutes);

//Inicio
app.get('/', (req, res) => {
  res.render('index');
});

//Creamos escuchador
const connectedServer = app.listen(PORT, ()=> {
  console.log(`Server is up and running on port ${PORT}`);
});

//Definimos manejo de errores
connectedServer.on('error', (error) => {
  console.error('Error: ', error);
})
