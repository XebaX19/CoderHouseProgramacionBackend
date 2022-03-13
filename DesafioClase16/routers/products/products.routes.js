//Importamos librerías
const express = require('express');
const router = express.Router();
const dbconfig = require('../../db/config');

//Importación de clase Contenedor
const ClaseContenedor = require('../../data/Contenedor');
const contenedorProductos = new ClaseContenedor(dbconfig.mariaDB, 'productos');
const arrayProductos = contenedorProductos.getAll();

//Routes (/productos)
// router.get('/', (req, res) => {
//     res.render('products', {arrayProductos});
// });

// router.post('/', (req, res) => {
//     const { nombre, precio, fotoUrl } = req.body;
    
//     if (!nombre || !precio || !fotoUrl) {
//         return res.send('<script>alert("El formato del Body enviado es incorrecto"); window.location.href = "/";</script>');
//     }

//     const newProduct = productos.save(nombre, +precio, fotoUrl);
    
//     // return res.redirect('/'); //No utilizo el redirect para mostrar un msj cuando se agrega el nuevo producto
//     return res.send('<script>alert("Producto agregado correctamente"); window.location.href = "/";</script>');
// });

module.exports = router;