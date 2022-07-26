//Importación de clases
const OrdenesService = require('../services/ordenes/ordenes.services');
const ordenesServices = new OrdenesService();
const { STATUS } = require('../utils/constants/api.constants');
const { apiSuccessResponse } = require('../utils/api.utils');

const getOrdenesAllController = async (req, res, next) => {
    try {
        const ordenes = await ordenesServices.getOrdenesService();
        const response = apiSuccessResponse(ordenes, STATUS.OK);
    
        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const getOrdenesByUsuarioController = async (req, res, next) => {
    try {
        const { usuario } = req.params;

        const ordenes = await ordenesServices.getOrdenesByUsuarioService(usuario);
        const response = apiSuccessResponse(ordenes, STATUS.OK);
    
        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const createOrdenController = async (req, res, next) => {
    try {
        const { idCarrito } = req.params;

        const resultado = await ordenesServices.createOrdenService(idCarrito);
        const response = apiSuccessResponse(resultado, STATUS.OK);

        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOrdenesAllController,
    getOrdenesByUsuarioController,
    createOrdenController
};