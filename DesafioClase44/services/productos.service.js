const ProductosRepo = require('../repositories/ProductosRepo');

class ProductoService {
    constructor() {
        this.productosRepo = new ProductosRepo();
    }

    async getAllProductosService() {
        return await this.productosRepo.getAllProductosRepo();
    }

    async getProductoByIdService(id) {
        return await this.productosRepo.getProductoByIdRepo(id);
    }

    async saveProductoService(producto) {
        return await this.productosRepo.saveProductoRepo(producto);
    }

    async updateProductoByIdService(id, producto) {
        return await this.productosRepo.updateProductoByIdRepo(id, producto);
    }

    async deleteProductoByIdService(id) {
        return await this.productosRepo.deleteProductoByIdRepo(id);
    }
}

module.exports = ProductoService;