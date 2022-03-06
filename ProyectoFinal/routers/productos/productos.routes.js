//Importamos librerías
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authorizer');

//Importación de clases
const Producto = require('../../data/Producto');
const Contenedor = require('../../data/Contenedor');
const productosArchivo = new Contenedor('productos.txt');

//Routes (/api/productos)
router.get('/', (req, res) => {

    //Si recibo un id en req.query, muestro el producto en particular, caso contrario muestro todos los productos
    const { id } = req.query;

    if (id) {
        productosArchivo.getById(id).then(prod => {
            if (prod === null) {
                return res.status(404).json({ mensaje: `No se encontró el producto con id ${id}` });
            }
    
            return res.json(prod);
        }); 
    } else {
        productosArchivo.getAll().then(prods => {
            if (prods.length === 0) {
                return res.status(404).json({ mensaje: "No se encontraron productos" });
            }
    
            return res.json(prods);
        });
    }
});

router.post('/', authMiddleware, (req, res) => {
    const { nombre, descripcion, codigo, fotoUrl, precio, stock } = req.body;

    if (!nombre || !descripcion || !codigo || !fotoUrl || !precio || !stock) {
        return res.status(400).json({ error: 'El formato del Body enviado es incorrecto' });
    }

    let nuevoProducto = new Producto(nombre, descripcion, codigo, fotoUrl, precio, stock);
    productosArchivo.save(nuevoProducto).then(id => {
        if (id < 0) {
            return res.status(500).json({ error: 'Error al agregar producto' });
        }

        nuevoProducto.id = id;
        return res.json({ mensaje: "Producto agregado", nuevoProducto });
    });
});

router.put('/:id', authMiddleware, (req, res) => {
    const { params: { id }, body: { nombre, descripcion, codigo, fotoUrl, precio, stock } } = req;

    if (!nombre || !descripcion || !codigo || !fotoUrl || !precio || !stock) {
        return res.status(400).json({ error: 'El formato del Body enviado es incorrecto' });
    }

    productosArchivo.getAll().then(productos => {
        const productoIndex = productos.findIndex(product => product.id === +id);

        if (productoIndex < 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        let productoActualizado = productos[productoIndex];
        productoActualizado.nombre = nombre;
        productoActualizado.descripcion = descripcion;
        productoActualizado.codigo = codigo;
        productoActualizado.fotoUrl = fotoUrl;
        productoActualizado.precio = precio;
        productoActualizado.stock = stock;

        productosArchivo.update(productoActualizado).then((actualizadoOk) => {
            if (!actualizadoOk) {
                return res.status(500).json({ error: 'Error al modificar producto' });
            }

            return res.json({ mensaje: "Producto modificado", productoActualizado });
        });
    });
});

router.delete('/:id', authMiddleware, (req, res) => {
    const { id } = req.params;

    productosArchivo.getAll().then(productos => {
        const productoIndex = productos.findIndex(product => product.id === +id);

        if (productoIndex < 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        productosArchivo.deleteById(id).then((eliminadoOk) => {
            if (!eliminadoOk) {
                return res.status(500).json({ error: 'Error al eliminar producto' });
            }

            return res.json({ mensaje: "Producto eliminado" });
        });
    });
});

module.exports = router;