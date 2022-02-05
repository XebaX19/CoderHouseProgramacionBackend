//Importación de express
const express = require('express');
const PORT = 8080;

//Importación de claseContenedor
const claseContenedor = require('./claseContenedor');
const Contenedor = claseContenedor.Contenedor;
const nuevoContenedor = new Contenedor('productos.txt');

//Creación de servidor
const app = express();

//Inicio
app.get('/', (req, res) => {
    res.send('<h1>Bienvenido al servidor Express!</h1>');
});

//Endpoint /productos
app.get('/productos', (req, res) => {
    try {
        nuevoContenedor.getAll().then(productos => res.send(productos));
    } catch (err) {
        res.send(`Error al recuperar productos: ${err}`);
    } 
});

//Endpoint /productosRandom
app.get('/productoRandom', (req, res) => {
    const min = 0;
    let max = 0;
    let nroRandom = 0;

    try {
        nuevoContenedor.getAll().then(productos => {
            max = productos.length;
            
            // Retorna un número aleatorio entre min (incluido) y max (excluido)
            nroRandom = parseInt(Math.random() * (max - min) + min);
            const productoRandom = productos[nroRandom];
            
            res.send(productoRandom);
        });
    } catch (err) {
        res.send(`Error al recuperar productos: ${err}`);
    } 
});

//Creamos escuchador
const connectedServer = app.listen(PORT, () => {
    console.log(`Servidor activo y escuchando en el puerto: ${PORT}`);
});

//Definimos manejo de errores
connectedServer.on('error', (err) => {
    console.log(err.message);
});