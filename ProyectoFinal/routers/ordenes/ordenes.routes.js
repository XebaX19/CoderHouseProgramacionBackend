//Importamos librerías
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authorizer.middleware');
const { getOrdenesAllController,
        getOrdenesByUsuarioController,
        createOrdenController     
} = require('../../controllers/ordenes.controllers');

//Routes (/api/ordenes)
router.get('/', authMiddleware, getOrdenesAllController);

router.get('/:usuario', authMiddleware, getOrdenesByUsuarioController);

router.post('/:idCarrito', authMiddleware, createOrdenController);

module.exports = router;