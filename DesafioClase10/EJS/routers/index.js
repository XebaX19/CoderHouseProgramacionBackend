//Importamos librerías
const express = require('express');
const router = express.Router();

//Importamos los .routes.js (miniapps de cada recurso)
const productsRoutes = require('./products/products.routes');

//Middlewares
router.use(express.json());
router.use(express.urlencoded({extended: true}));

//Routes
router.use('/productos', productsRoutes);

module.exports = router;