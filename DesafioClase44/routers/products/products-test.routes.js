//Importamos librerías
const express = require('express');
const router = express.Router();
const { productsTestControllers } = require('../../controllers/products-test.controllers');

//Routes (api/productos-test)
router.get('/', productsTestControllers);

module.exports = router;