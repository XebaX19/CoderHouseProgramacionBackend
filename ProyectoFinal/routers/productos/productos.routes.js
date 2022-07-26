//Importamos librerías
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authorizer.middleware');
const { getProductosAllController,
        getProductoByIdController,
        getProductosByCategoriaController,
        createProductoController,
        updateProductoController,
        deleteProductoController        
} = require('../../controllers/productos.controller');

//Routes (/api/productos)
router.get('/', getProductosAllController);

router.get('/:id', getProductoByIdController);

router.get('/categoria/:categoria', getProductosByCategoriaController)

router.post('/', authMiddleware, createProductoController);

router.put('/:id', authMiddleware, updateProductoController);

router.delete('/:id', authMiddleware, deleteProductoController);

module.exports = router;