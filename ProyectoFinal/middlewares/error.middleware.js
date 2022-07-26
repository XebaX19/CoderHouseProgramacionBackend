const { apiFailedResponse } = require('../utils/api.utils');
const logger = require('../logger/index');

const errorMiddleware = (error, req, res, next) => {
    const status = error.statusCode || 500;
    const errorItem = {
        message: error.message,
        details: error.details
    };
    const errorResponse = apiFailedResponse(errorItem, status);

    if (status > 400 && status < 499) {
        logger.warn(error);
    }
    if (status > 500 && status < 599) {
        logger.error(error);
    }
    
    return res.status(status).json(errorResponse);
};

module.exports = errorMiddleware;