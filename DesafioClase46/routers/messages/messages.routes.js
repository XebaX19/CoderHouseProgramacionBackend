//Importamos librerías
const Router = require('koa-router');
const MensajeController = require('../../controllers/messages.controllers');
const controller = new MensajeController();

const router = new Router({
    prefix: '/mensajes'
});

//Routes (api/mensajes)
router.get('/', controller.getMensajesController);
router.post('/', controller.saveMensajeController);

module.exports = router;