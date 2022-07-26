const jwt = require('jsonwebtoken');
const env = require('../config/env.config');
const { STATUS } = require('../utils/constants/api.constants');
const { apiFailedResponse } = require('../utils/api.utils');

const authorizer = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        const response = apiFailedResponse(`El header 'Authorization' es requerido`, STATUS.UNAUTHORIZED)
    
        return res.status(STATUS.UNAUTHORIZED).json(response);
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, env.JWT_PRIVATE_KEY, (err, decode) => {
        if (err) {
            const response = apiFailedResponse(`Acceso denegado a ${req.method} ${req.originalUrl}`, STATUS.FORBIDDEN)
    
            return res.status(STATUS.FORBIDDEN).json(response);
        } else {
            next();//para que se ejecute la siguiente instrucción
        }
    });
};

module.exports = authorizer;