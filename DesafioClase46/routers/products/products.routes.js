//Importamos librerías
const Router = require('koa-router');
const ProductoController = require('../../controllers/products.controllers');
const controller = new ProductoController();

const router = new Router({
    prefix: '/productos'
});

//Routes (api/productos)
router.get('/', controller.getProductosController);
router.get('/:id', controller.getProductoByIdController);
router.post('/', controller.saveProductoController);
router.put('/:id', controller.updateProductoByIdController);
router.delete('/:id', controller.deleteProductoByIdController);

module.exports = router;