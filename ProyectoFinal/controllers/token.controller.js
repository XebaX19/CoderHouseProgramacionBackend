//Importación de clases
const TokenService = require('../services/token/token.services');
const tokenServices = new TokenService();
const { STATUS } = require('../utils/constants/api.constants');
const { apiSuccessResponse } = require('../utils/api.utils');

const getTokenController = async (req, res, next) => {
    try {
        const { usuario, password } = req.body;
        const access_token = await tokenServices.getTokenService(usuario, password);
        const response = apiSuccessResponse({ access_token }, STATUS.OK);
    
        return res.status(STATUS.OK).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTokenController
};