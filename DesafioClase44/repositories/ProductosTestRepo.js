const dbConfig = require('../db/config');
const ClaseContenedorSQL = require('../models/contenedores/ContenedorSQL');

class ProductosTestRepo {
    constructor() {
        this.contenedor = new ClaseContenedorSQL(dbConfig.mariaDB, 'productos');
        this.getAllProductosTestRepo = this.getAllProductosTestRepo.bind(this); 
        this.saveProductoTestRepo = this.saveProductoTestRepo.bind(this); 
    }

    async getAllProductosTestRepo() {
        return await this.contenedor.getAll();
    }

    async saveProductoTestRepo(title, price, thumbnail) {
        await this.contenedor.saveProduct(title, price, thumbnail);
    }
}

module.exports = ProductosTestRepo;