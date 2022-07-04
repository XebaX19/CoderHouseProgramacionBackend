const ProductoService = require('../services/productos.service');

class ProductoController {
  constructor() {
    this.service = new ProductoService();
    this.getProductosController = this.getProductosController.bind(this);
    this.getProductoByIdController = this.getProductoByIdController.bind(this);
    this.saveProductoController = this.saveProductoController.bind(this);
    this.updateProductoByIdController = this.updateProductoByIdController.bind(this);
    this.deleteProductoByIdController = this.deleteProductoByIdController.bind(this);
  }

  async getProductosController(ctx) {
    try {
      const productos = await this.service.getAllProductosService();

      if(!productos || productos.length === 0) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontraron productos`
        };
        return;
      }

      ctx.body = {
        success: true,
        data: productos
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductoByIdController(ctx, next) {
    try {
      const { id } = ctx.params;
      const producto = await this.service.getProductoByIdService(id); 

      if(!producto) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontró el producto con id ${id}`
        };
        return;
      }

      ctx.body = {
        success: true,
        data: producto
      };
    } catch (error) {
      next(error);
    }
  }

  async saveProductoController(ctx, next) {
    try {
      const producto = ctx.request.body;
      if (!producto || !producto.title || !producto.price || isNaN(producto.price) || !producto.thumbnail) {
        ctx.response.status = 400;
        ctx.body = {
            success: false,
            message: `Parámetros incorrectos.`
        };
        return;
      }

      const newProduct = await this.service.saveProductoService(producto);

      ctx.response.status = 201;
      ctx.body = {
          success: true,
          data: newProduct
      };
    } catch (error) {
      next(error);
    }
  }

  async updateProductoByIdController(ctx, next) {
    try {
      const producto = ctx.request.body;
      const { id } = ctx.params;

      const productoBuscado = await this.service.getProductoByIdService(id); 

      if(!productoBuscado) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontró el producto con id ${id}`
        }
        return;
      }

      if (!producto || !producto.title || !producto.price || isNaN(producto.price) || !producto.thumbnail) {
        ctx.response.status = 400;
        ctx.body = {
            success: false,
            message: `Parámetros incorrectos.`
        };
        return;
      }

      const updatedProduct = await this.service.updateProductoByIdService(id, producto);

      ctx.body = {
        success: true,
        data: updatedProduct
      };
    } catch (error) {
      next(error);
    }
  }

  async deleteProductoByIdController(ctx, next) {
    try {
      const { id } = ctx.params;

      const productoBuscado = await this.service.getProductoByIdService(id); 

      if(!productoBuscado) {
        ctx.response.status = 404;
        ctx.body = {
            success: false,
            message: `No se encontró el producto con id ${id}`
        };
        return;
      }

      await this.service.deleteProductoByIdService(id);

      ctx.body = {
        success: true,
        data: `El producto con id ${id} fue eliminado correctamente`
      };
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductoController;