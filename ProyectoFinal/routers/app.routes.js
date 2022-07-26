//Importamos librerías
const express = require('express');
const router = express.Router();
const errorMiddleware = require('../middlewares/error.middleware');

//Importamos los .routes.js (miniapps de cada recurso)
const productosRoutes = require('./productos/productos.routes');
const carritoRoutes = require('./carrito/carrito.routes');
const tokenRoutes = require('./token/token.routes');
const ordenesRoutes = require('./ordenes/ordenes.routes');
const chatRoutes = require('./chat/chat.routes');

//Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Routes
router.use('/productos', productosRoutes);
router.use('/carrito', carritoRoutes);
router.use('/token', tokenRoutes);
router.use('/ordenes', ordenesRoutes);
router.use('/chat', chatRoutes);

//Error middleware
router.use(errorMiddleware);

module.exports = router;