const ProductosTestRepo = require('../repositories/ProductosTestRepo');
const productosTestRepo = new ProductosTestRepo();

const getAllProductosTestService = productosTestRepo.getAllProductosTestRepo;
const saveProductoTestService = productosTestRepo.saveProductoTestRepo;

module.exports = {
    getAllProductosTestService,
    saveProductoTestService
};