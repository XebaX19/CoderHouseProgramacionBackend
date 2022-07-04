const { getAllMensajesService, saveMensajeService } = require('../services/mensajes.service');

class MensajeController {
  constructor() {
    this.getMensajesController = this.getMensajesController.bind(this);
    this.saveMensajeController = this.saveMensajeController.bind(this);
  }

  async getMensajesController(ctx) {
    try {
      const mensajes = await getAllMensajesService();

      if(!mensajes || mensajes.length === 0) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontraron mensajes`
        };
        return;
      }

      ctx.body = {
        success: true,
        data: mensajes
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveMensajeController(ctx, next) {
    try {
      const mensaje = ctx.request.body;
      if (!mensaje || !mensaje.email || !mensaje.msj) {
        ctx.response.status = 400;
        ctx.body = {
            success: false,
            message: `Parámetros incorrectos.`
        };
        return;
      }

      const newMensaje = await saveMensajeService(mensaje);

      ctx.response.status = 201;
      ctx.body = {
          success: true,
          data: newMensaje
      };
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MensajeController;