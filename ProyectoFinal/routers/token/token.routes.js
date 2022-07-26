//Importamos librerías
const express = require('express');
const router = express.Router();
const { getTokenController } = require('../../controllers/token.controller');

//Routes (/api/token)
router.post('/', getTokenController);

module.exports = router;