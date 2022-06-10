const dbConfig = require('../db/config');
const ClaseContenedorSQL = require('../models/contenedores/ContenedorSQL');

class ProductosRepo {
    constructor() {
        this.contenedor = new ClaseContenedorSQL(dbConfig.mariaDB, 'productos');
        this.getAllProductosRepo = this.getAllProductosRepo.bind(this); 
        this.saveProductoRepo = this.saveProductoRepo.bind(this); 
    }

    async getAllProductosRepo() {
        return await this.contenedor.getAll();
    }

    async saveProductoRepo(title, price, thumbnail) {
        await this.contenedor.saveProduct(title, price, thumbnail);
    }
}

module.exports = ProductosRepo;