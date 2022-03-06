//Importamos librerías
const express = require('express');
const router = express.Router();

//Importación de clase Contenedor
const Carrito = require('../../data/Carrito');
const Contenedor = require('../../data/Contenedor');
const carritosArchivo = new Contenedor('carritos.txt');
const productosArchivo = new Contenedor('productos.txt');

//Routes (/api/carrito)
router.post('/', (req, res) => {
    let nuevoCarrito = new Carrito([]);
    carritosArchivo.save(nuevoCarrito).then(id => {
        if (id < 0) {
            return res.status(500).json({ error: 'Error al agregar carrito' });
        }

        nuevoCarrito.id = id;
        return res.json({ mensaje: "Carrito agregado", id });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    carritosArchivo.getAll().then(carritos => {
        const carritoIndex = carritos.findIndex(carrito => carrito.id === +id);

        if (carritoIndex < 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        carritosArchivo.deleteById(id).then((eliminadoOk) => {
            if (!eliminadoOk) {
                return res.status(500).json({ error: 'Error al eliminar carrito' });
            }

            return res.json({ mensaje: "Carrito eliminado" });
        });
    });
});

router.get('/:id/productos', (req, res) => {
    const { id } = req.params;

    carritosArchivo.getById(id).then(carrito => {
        if (carrito === null) {
            return res.status(404).json({ mensaje: `No se encontró el carrito con id ${id}` });
        }

        return res.json({productos: carrito.productos});
    }); 
});

router.post('/:id/productos/:id_prod', (req, res) => {
    const { id, id_prod } = req.params;

    carritosArchivo.getById(+id).then(carrito => {
        if (carrito === null) {
            return res.status(404).json({ mensaje: `No se encontró el carrito con id ${id}` });
        }

        productosArchivo.getById(+id_prod).then(producto => {
            if (producto === null) {
                return res.status(404).json({ mensaje: `No se encontró el producto con id ${id_prod}` });
            }

            carrito.productos.push(producto);

            carritosArchivo.update(carrito).then(actualizadoOk => {
                if (!actualizadoOk) {
                    return res.status(500).json({ error: 'Error al agregar producto al carrito' });
                }
    
                return res.json({ mensaje: "Producto agregado al carrito" });
            }); 
        }); 
    }); 
});

router.delete('/:id/productos/:id_prod', (req, res) => {
    const { id, id_prod } = req.params;

    carritosArchivo.getById(+id).then(carrito => {
        if (carrito === null) {
            return res.status(404).json({ mensaje: `No se encontró el carrito con id ${id}` });
        }

        productosArchivo.getById(+id_prod).then(producto => {
            if (producto === null) {
                return res.status(404).json({ mensaje: `No se encontró el producto con id ${id_prod}` });
            }

            const indexProducto = carrito.productos.findIndex(prod => prod.id === +id_prod);
            
            if (indexProducto < 0) {
                return res.status(404).json({ mensaje: `El carrito no contiene un producto con id ${id_prod}` });
            }
            
            carrito.productos.splice(indexProducto, 1);
            carritosArchivo.update(carrito).then(actualizadoOk => {
                if (!actualizadoOk) {
                    return res.status(500).json({ error: 'Error al eliminar producto del carrito' });
                }
    
                return res.json({ mensaje: "Producto eliminado del carrito" });
            }); 
        }); 
    }); 
});

module.exports = router;