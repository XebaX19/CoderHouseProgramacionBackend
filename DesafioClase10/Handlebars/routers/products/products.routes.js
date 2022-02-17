//Importamos librerías
const express = require('express');
const router = express.Router();

//Importación de clase Products
const ClaseProductos = require('../../data/Products');
const productos = new ClaseProductos();
const arrayProductos = productos.getAll();

//Routes (/productos)
router.get('/', (req, res) => {
    res.render('products', {arrayProductos});
});

router.post('/', (req, res) => {
    const { nombre, precio, fotoUrl } = req.body;
    
    if (!nombre || !precio || !fotoUrl) {
        return res.send('<script>alert("El formato del Body enviado es incorrecto"); window.location.href = "/";</script>');
    }

    const newProduct = productos.save(nombre, +precio, fotoUrl);
    
    // return res.redirect('/'); //No utilizo el redirect para mostrar un msj cuando se agrega el nuevo producto
    return res.send('<script>alert("Producto agregado correctamente"); window.location.href = "/";</script>');
});

module.exports = router;