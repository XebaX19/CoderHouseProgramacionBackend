//Importamos librerías
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authorizer.middleware');
const { getCarritosController,
        createCarritoController,
        deleteCarritoController,
        getProductosByCarritoController,
        addProductoCarritoController,
        removeProductoCarritoController,
        confirmaPedidoCarritoController
} = require('../../controllers/carritos.controller');

//Routes (/api/carrito)
router.get('/', authMiddleware, getCarritosController);

router.post('/', authMiddleware, createCarritoController);

router.delete('/:id', authMiddleware, deleteCarritoController);

router.get('/:id/productos', authMiddleware, getProductosByCarritoController);

router.post('/:id/productos/:id_prod', authMiddleware, addProductoCarritoController);

router.delete('/:id/productos/:id_prod', authMiddleware, removeProductoCarritoController);

router.post('/:idCarrito/confirmaPedido', authMiddleware, confirmaPedidoCarritoController);

module.exports = router;