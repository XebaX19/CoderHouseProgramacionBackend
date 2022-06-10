//Importamos librerías
const express = require('express');
const router = express.Router();
const { productsControllers } = require('../../controllers/products.controllers');

//Routes (api/productos-test)
router.get('/', productsControllers);

module.exports = router;