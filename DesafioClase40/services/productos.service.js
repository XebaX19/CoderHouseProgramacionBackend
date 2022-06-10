const ProductosRepo = require('../repositories/ProductosRepo');
const productosRepo = new ProductosRepo();

const getAllProductosService = productosRepo.getAllProductosRepo;
const saveProductoService = productosRepo.saveProductoRepo;

module.exports = {
    getAllProductosService,
    saveProductoService
};