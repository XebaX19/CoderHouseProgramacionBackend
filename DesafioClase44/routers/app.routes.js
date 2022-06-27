//Importamos librerías
const express = require('express');
const router = express.Router();

//Importamos los .routes.js (miniapps de cada recurso)
const productsTestRoutes = require('./products/products-test.routes');
const productsRoutes = require('./products/products.routes');
const randomsRoutes = require('./randoms/randoms.routes');

//Middlewares
router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.use(express.static('./public'));

//Routes
router.use('/productos-test', productsTestRoutes);
router.use('/productos', productsRoutes);
router.use('/randoms', randomsRoutes);

module.exports = router;