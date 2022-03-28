//Importamos librerías
const express = require('express');
const router = express.Router();

//Importación de clases
const { CarritoDao, ProductosDao } = require('../../models/daos/index');
const carritoDao = new CarritoDao();
const productosDao = new ProductosDao();

//Routes (/api/carrito)
router.post('/', async (req, res) => {
    const newCarrito = {productos: []};

    const resultado = await carritoDao.save(newCarrito);

    if (resultado === -1) {
        return res.status(500).json({ error: 'Error al agregar carrito' });
    } else {
        return res.json({ mensaje: 'Carrito agregado', nuevoCarrito: resultado });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const resultadoBusqueda = await carritoDao.getById(id);

    if (resultadoBusqueda === -1) {
        return res.status(500).json({ mensaje: `Hubo un error al buscar el carrito con id ${id}` });
    }
    if (resultadoBusqueda === null) {
        return res.status(404).json({ mensaje: `No se encontró el carrito con id ${id}` });
    }

    const resultadoEliminacion= await carritoDao.deleteById(id);

    if (!resultadoEliminacion) {
        return res.status(500).json({ error: 'Error al eliminar carrito' });
    }

    return res.json({ mensaje: 'Carrito eliminado' });
});

router.get('/:id/productos', async (req, res) => {
    const { id } = req.params;

    const resultadoBusqueda = await carritoDao.getById(id);

    if (resultadoBusqueda === -1) {
        return res.status(500).json({ mensaje: `Hubo un error al buscar el carrito con id ${id}` });
    }
    if (resultadoBusqueda === null) {
        return res.status(404).json({ mensaje: `No se encontró el carrito con id ${id}` });
    }

    return res.json({productos: resultadoBusqueda.productos});
});

router.post('/:id/productos/:id_prod', async (req, res) => {
    const { id, id_prod } = req.params;

    //Búsqueda carrito
    const resultadoBusquedaCarrito = await carritoDao.getById(id);

    if (resultadoBusquedaCarrito === -1) {
        return res.status(500).json({ mensaje: `Hubo un error al buscar el carrito con id ${id}` });
    }
    if (resultadoBusquedaCarrito === null) {
        return res.status(404).json({ mensaje: `No se encontró el carrito con id ${id}` });
    }

    //Búsqueda producto
    const resultadoBusquedaProducto = await productosDao.getById(id_prod);

    if (resultadoBusquedaProducto === -1) {
        return res.status(500).json({ mensaje: `Hubo un error al buscar el producto con id ${id_prod}` });
    }
    if (resultadoBusquedaProducto === null) {
        return res.status(404).json({ mensaje: `No se encontró el producto con id ${id_prod}` });
    }

    //Agrega producto a carrito
    const resultadoAdd = await carritoDao.addItemToArray('productos', resultadoBusquedaCarrito, resultadoBusquedaProducto);

    if (!resultadoAdd) {
        return res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }

    return res.json({ mensaje: 'Producto agregado al carrito' });
});

router.delete('/:id/productos/:id_prod', async (req, res) => {
    const { id, id_prod } = req.params;

    //Búsqueda carrito
    const resultadoBusquedaCarrito = await carritoDao.getById(id);

    if (resultadoBusquedaCarrito === -1) {
        return res.status(500).json({ mensaje: `Hubo un error al buscar el carrito con id ${id}` });
    }
    if (resultadoBusquedaCarrito === null) {
        return res.status(404).json({ mensaje: `No se encontró el carrito con id ${id}` });
    }

    //Búsqueda producto
    const resultadoBusquedaProducto = await productosDao.getById(id_prod);

    if (resultadoBusquedaProducto === -1) {
        return res.status(500).json({ mensaje: `Hubo un error al buscar el producto con id ${id_prod}` });
    }
    if (resultadoBusquedaProducto === null) {
        return res.status(404).json({ mensaje: `No se encontró el producto con id ${id_prod}` });
    }

    //Elimina producto de carrito
    const resultadoEliminacion = await carritoDao.removeItemFromArray('productos', resultadoBusquedaCarrito, resultadoBusquedaProducto);

    if (resultadoEliminacion === -1) {
        return res.status(404).json({ mensaje: `No se encontró el producto con id ${id_prod} dentro del carrito con id ${id}` });
    }
    if (!resultadoEliminacion) {
        return res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }

    return res.json({ mensaje: 'Producto eliminado del carrito' });
});

module.exports = router;