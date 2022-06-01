const dbConfig = require('../db/config');
const ClaseContenedorSQL = require('../models/contenedores/ContenedorSQL');
const contenedorProductos = new ClaseContenedorSQL(dbConfig.mariaDB, 'productos');

const getAllProductosService = async () => {
    return await contenedorProductos.getAll();
};

const saveProductoService = async (title, price, thumbnail) => {
    await contenedorProductos.saveProduct(title, price, thumbnail);
};

module.exports = {
    getAllProductosService,
    saveProductoService
};