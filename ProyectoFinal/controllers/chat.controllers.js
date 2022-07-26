//Importación de clases
const MensajesServices = require('../services/mensajes/mensajes.services');
const mensajesServices = new MensajesServices();
const { STATUS } = require('../utils/constants/api.constants');
const { apiSuccessResponse } = require('../utils/api.utils');

const getChatAllController = async (req, res, next) => {
    try {
        const chat = await mensajesServices.getAllMensajesService();
        const response = apiSuccessResponse(chat, STATUS.OK);
    
        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const getChatByUsuarioController = async (req, res, next) => {
    try {
        const { usuario } = req.params;

        const chat = await mensajesServices.getMensajesByUsuarioService(usuario);
        const response = apiSuccessResponse(chat, STATUS.OK);
    
        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

const createChatController = async (req, res, next) => {
    try {
        const { emailUsuario, mensaje, tipo } = req.body;
        const newMensaje = { emailUsuario, mensaje, tipo };
    
        const resultado = await mensajesServices.createMensajeService(newMensaje);
        const response = apiSuccessResponse(resultado, STATUS.CREATED);
    
        return res.status(STATUS.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getChatAllController,
    getChatByUsuarioController,
    createChatController
};