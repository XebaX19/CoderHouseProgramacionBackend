//Importación de clases
const ProductosService = require('../services/productos/productos.services');
const productosServices = new ProductosService();
const { STATUS } = require('../utils/constants/api.constants');
const { apiSuccessResponse } = require('../utils/api.utils');

const getProductosAllController = async (req, res, next) => {
    try {
        const productos = await productosServices.getProductosService();
        const response = apiSuccessResponse(productos, STATUS.OK);
    
        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const getProductoByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const producto = await productosServices.getProductoByIdService(id);
        const response = apiSuccessResponse(producto, STATUS.OK);
    
        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const getProductosByCategoriaController = async (req, res, next) => {
    try {
        const { categoria } = req.params;

        const producto = await productosServices.getProductosByCategoriaService(categoria);
        const response = apiSuccessResponse(producto, STATUS.OK);
    
        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const createProductoController = async (req, res, next) => {
    try {
        const { nombre, descripcion, codigo, fotoUrl, precio, stock, categoria } = req.body;
        const newProducto = { nombre, descripcion, codigo, fotoUrl, precio, stock, categoria };
    
        const resultado = await productosServices.createProductoService(newProducto);
        const response = apiSuccessResponse(resultado, STATUS.CREATED);
    
        return res.status(STATUS.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

const updateProductoController = async (req, res, next) => {
    try {
        const { params: { id }, body: { nombre, descripcion, codigo, fotoUrl, precio, stock, categoria } } = req;
        const productoActualizado = { nombre, descripcion, codigo, fotoUrl, precio, stock, categoria };
        
        const resultadoActualiza = await productosServices.updateProductoService(id, productoActualizado);
        const response = apiSuccessResponse(resultadoActualiza, STATUS.OK);

        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteProductoController = async (req, res, next) => {
    try {
        const { id } = req.params;
    
        await productosServices.deleteProductoService(id);
        const response = apiSuccessResponse({ mensaje: 'Producto eliminado' }, STATUS.OK);

        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductosAllController,
    getProductoByIdController,
    getProductosByCategoriaController,
    createProductoController,
    updateProductoController,
    deleteProductoController,
};