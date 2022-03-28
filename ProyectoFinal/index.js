//Importamos librerías
const express = require('express');

const PORT = process.env.PORT || 8080;
const app = express();

//Importamos index del router
const apiRoutes = require('./routers/index');

// Middlewares
//app.use(express.static('public')); 

// Routes
app.use('/api', apiRoutes);

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
const connectedServer = app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});

//Definimos manejo de errores
connectedServer.on('error', (error) => {
    console.error('Error: ', error);
});
