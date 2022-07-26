//Importamos librerías
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authorizer.middleware');
const { getChatAllController,
        getChatByUsuarioController,
        createChatController
} = require('../../controllers/chat.controllers');

//Routes (/api/chat)
router.get('/', authMiddleware, getChatAllController);

router.get('/:usuario', authMiddleware, getChatByUsuarioController);

router.post('/', authMiddleware, createChatController);

module.exports = router;