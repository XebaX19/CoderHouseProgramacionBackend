//Importamos librerías
const express = require('express');
const router = express.Router();

//Importación de clase Products
const ClaseProductos = require('../../data/Products');
const productos = new ClaseProductos();

//Routes (/api/productos)
router.get('/', (req, res) => {
    if (productos.getAll().length === 0) {
        return res.status(404).json({mensaje: "No se encontraron productos"});
    }

    return res.json(productos.getAll());
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const producto = productos.getById(+id);
    
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    return res.json({ producto: producto });
});

router.post('/', (req, res) => {
    const { title, price, thumbnail } = req.body;
    
    if (!title || !price || !thumbnail) {
        return res.status(400).json({ error: 'El formato del Body enviado es incorrecto' });
    }

    const newProduct = productos.save(title, +price, thumbnail);
    
    return res.json({ nuevoProducto: newProduct });
});

router.put('/:id', (req, res) => {
    const { params: { id }, body: { title, price, thumbnail } } = req;
    
    if (!title || !price || !thumbnail) {
        return res.status(400).json({ error: 'El formato del Body enviado es incorrecto' });
    }

    const productoIndex = productos.getAll().findIndex(product => product.id === +id);
    if (productoIndex < 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updateProduct = {
        id: +id,
        title,
        price,
        thumbnail
    };

    const productoActualizado = productos.update(updateProduct, productoIndex);

    return res.json({ productoActualizado: productoActualizado });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const productoIndex = productos.getAll().findIndex(product => product.id === +id);

    if (productoIndex < 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    const eliminadoOk = productos.delete(productoIndex);

    if (!eliminadoOk) {
        return res.status(500).json({ error: 'Error al eliminar producto' });
    }

    return res.json({ resultado: 'Producto eliminado correctamente' });
});

module.exports = router;