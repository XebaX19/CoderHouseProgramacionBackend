//Importamos librerías
const Router = require('koa-router');
const UsuarioController = require('../../controllers/users.controllers');
const controller = new UsuarioController();

const router = new Router({
    prefix: '/usuarios'
});

//Routes (api/usuarios)
router.get('/', controller.getUsuariosController);
router.get('/:id', controller.getUsuarioByIdController);
router.post('/', controller.saveUsuarioController);
router.put('/:id', controller.updateUsuarioByIdController);
router.delete('/:id', controller.deleteUsuarioByIdController);

module.exports = router;