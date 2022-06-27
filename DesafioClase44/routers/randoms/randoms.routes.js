//Importamos librerías
const express = require('express');
const router = express.Router();
const { randomsControllers } = require('../../controllers/randoms.controllers');

//Routes (api/randoms)
router.get('/', randomsControllers);

module.exports = router;