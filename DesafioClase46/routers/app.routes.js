//Importamos librerías
const Router = require('koa-router');

//Importamos los .routes.js (miniapps de cada recurso)
const productsRoutes = require('./products/products.routes');
const usersRoutes = require('./users/users.routes');
const messagesRoutes = require('./messages/messages.routes');

const router = new Router({
    prefix: '/api'
});

//Routes
router.use(productsRoutes.routes());
router.use(usersRoutes.routes());
router.use(messagesRoutes.routes());

module.exports = router;