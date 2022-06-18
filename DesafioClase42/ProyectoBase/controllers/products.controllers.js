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

  async getProductosController(req, res, next) {
    try {
      const productos = await this.service.getAllProductosService();

      if(!productos || productos.length === 0) {
        return res.sendStatus(404);
      }

      res.json(productos);
    } catch (error) {
      next(error);
    }
  }

  async getProductoByIdController(req, res, next) {
    try {
      const { id } = req.params;
      const producto = await this.service.getProductoByIdService(id); 

      if(!producto) {
        return res.sendStatus(404);
      }
    
      res.json(producto); 
    } catch (error) {
      next(error);
    }
  }

  async saveProductoController(req, res, next) {
    try {
      const producto = req.body;
      const newProduct = await this.service.saveProductoService(producto);

      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  async updateProductoByIdController(req, res, next) {
    try {
      const producto = req.body;
      const { id } = req.params;

      const productoBuscado = await this.service.getProductoByIdService(id); 

      if(!productoBuscado) {
        return res.sendStatus(404);
      }

      const updatedProduct = await this.service.updateProductoByIdService(id, producto);

      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductoByIdController(req, res, next) {
    try {
      const { id } = req.params;

      const productoBuscado = await this.service.getProductoByIdService(id); 

      if(!productoBuscado) {
        return res.sendStatus(404);
      }

      await this.service.deleteProductoByIdService(id);

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductoController;