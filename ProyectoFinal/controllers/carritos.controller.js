const CarritoService = require('../services/carrito/carrito.services');
const carritoServices = new CarritoService();
const { STATUS } = require('../utils/constants/api.constants');
const { apiSuccessResponse } = require('../utils/api.utils');

const getCarritosController = async (req, res, next) => {
    try {
        const resultado = await carritoServices.getCarritosService();
        const response = apiSuccessResponse(resultado, STATUS.OK);

        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
}

const createCarritoController = async (req, res, next) => {
    try {
        const { emailUsuario } = req.body;

        const resultado = await carritoServices.createCarritoService(emailUsuario);
        const response = apiSuccessResponse(resultado, STATUS.CREATED);
    
        return res.status(STATUS.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteCarritoController = async (req, res, next) => {
    try {
        const { id } = req.params;

        await carritoServices.deleteCarritoService(id);
        const response = apiSuccessResponse({ mensaje: 'Carrito eliminado' }, STATUS.OK);

        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const getProductosByCarritoController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const resultado = await carritoServices.getProductosByCarritoService(id);
        const response = apiSuccessResponse({ productos: resultado }, STATUS.OK);

        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const addProductoCarritoController = async (req, res, next) => {
    try {
        const { id, id_prod } = req.params;

        await carritoServices.addProductoCarritoService(id, id_prod);
        const response = apiSuccessResponse({ mensaje: 'Producto agregado al carrito' }, STATUS.CREATED);

        return res.status(STATUS.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

const removeProductoCarritoController = async (req, res, next) => {
    try {
        const { id, id_prod } = req.params;

        await carritoServices.removeProductoCarritoService(id, id_prod);
        const response = apiSuccessResponse({ mensaje: 'Producto eliminado del carrito' }, STATUS.OK);

        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const confirmaPedidoCarritoController = async (req, res, next) => {
    try {
        const { idCarrito } = req.params;

        const resultado = await carritoServices.confirmaPedidoCarritoService(idCarrito);
        const response = apiSuccessResponse(resultado, STATUS.OK);

        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCarritosController,
    createCarritoController,
    deleteCarritoController,
    getProductosByCarritoController,
    addProductoCarritoController,
    removeProductoCarritoController,
    confirmaPedidoCarritoController
};