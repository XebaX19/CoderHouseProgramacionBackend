const UsuarioService = require('../services/usuarios.service');

class UsuarioController {
  constructor() {
    this.service = new UsuarioService();
    this.getUsuariosController = this.getUsuariosController.bind(this);
    this.getUsuarioByIdController = this.getUsuarioByIdController.bind(this);
    this.saveUsuarioController = this.saveUsuarioController.bind(this);
    this.updateUsuarioByIdController = this.updateUsuarioByIdController.bind(this);
    this.deleteUsuarioByIdController = this.deleteUsuarioByIdController.bind(this);
  }

  async getUsuariosController(ctx) {
    try {
      const usuarios = await this.service.getAllUsuariosService();

      if(!usuarios || usuarios.length === 0) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontraron usuarios`
        };
        return;
      }

      ctx.body = {
        success: true,
        data: usuarios
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsuarioByIdController(ctx, next) {
    try {
      const { id } = ctx.params;
      const usuario = await this.service.getUsuarioByIdService(id); 

      if(!usuario) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontró el usuario con id ${id}`
        };
        return;
      }

      ctx.body = {
        success: true,
        data: usuario
      };
    } catch (error) {
      next(error);
    }
  }

  async saveUsuarioController(ctx, next) {
    try {
      const usuario = ctx.request.body;
      if (!usuario || !usuario.email || !usuario.password) {
        ctx.response.status = 400;
        ctx.body = {
            success: false,
            message: `Parámetros incorrectos.`
        };
        return;
      }

      const newUser = await this.service.saveUsuarioService(usuario);

      ctx.response.status = 201;
      ctx.body = {
          success: true,
          data: newUser
      };
    } catch (error) {
      next(error);
    }
  }

  async updateUsuarioByIdController(ctx, next) {
    try {
      const usuario = ctx.request.body;
      const { id } = ctx.params;

      const usuarioBuscado = await this.service.getUsuarioByIdService(id); 

      if(!usuarioBuscado) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontró el usuario con id ${id}`
        }
        return;
      }

      if (!usuario || !usuario.email || !usuario.password) {
        ctx.response.status = 400;
        ctx.body = {
            success: false,
            message: `Parámetros incorrectos.`
        };
        return;
      }

      const updatedUser = await this.service.updateUsuarioByIdService(id, usuario);

      ctx.body = {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      next(error);
    }
  }

  async deleteUsuarioByIdController(ctx, next) {
    try {
      const { id } = ctx.params;

      const usuarioBuscado = await this.service.getUsuarioByIdService(id); 

      if(!usuarioBuscado) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontró el usuario con id ${id}`
        };
        return;
      }

      await this.service.deleteUsuarioByIdService(id);

      ctx.body = {
        success: true,
        data: `El usuario con id ${id} fue eliminado correctamente`
      };
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsuarioController;