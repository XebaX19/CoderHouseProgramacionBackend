//Importamos librerías
const express = require('express');
const router = express.Router();
const ProductoController = require('../../controllers/products.controllers');
const controller = new ProductoController();

//Routes (api/productos)
router.get('/', controller.getProductosController);
router.get('/:id', controller.getProductoByIdController);
router.post('/', controller.saveProductoController);
router.put('/:id', controller.updateProductoByIdController);
router.delete('/:id', controller.deleteProductoByIdController);

module.exports = router;