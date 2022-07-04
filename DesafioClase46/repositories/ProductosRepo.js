const { ProductosDao } = require('../models/daos/DaosFactory');

class ProductosRepo {
    constructor() {
        this.productosDao = new ProductosDao();
        this.getAllProductosRepo = this.getAllProductosRepo.bind(this); 
        this.getProductoByIdRepo = this.getProductoByIdRepo.bind(this); 
        this.saveProductoRepo = this.saveProductoRepo.bind(this); 
        this.updateProductoByIdRepo = this.updateProductoByIdRepo.bind(this);
        this.deleteProductoByIdRepo = this.deleteProductoByIdRepo.bind(this);
    }

    async getAllProductosRepo() {
        return await this.productosDao.getAll();
    }

    async getProductoByIdRepo(id) {
        return await this.productosDao.getById(id);
    }

    async saveProductoRepo(producto) {
        return await this.productosDao.save(producto);
    }

    async updateProductoByIdRepo(id, producto) {
        return await this.productosDao.update(id, producto);
    }

    async deleteProductoByIdRepo(id) {
        return await this.productosDao.deleteById(id);
    }
}

module.exports = ProductosRepo;