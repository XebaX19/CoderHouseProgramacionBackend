const apiSuccessResponse = (data, statusCode = 200) => {
    return {
        error: false,
        statusCode,
        data
    }
};

const apiFailedResponse = (error, statusCode = 500) => {
    return {
        error: true,
        statusCode,
        error_datails: error
    }
};

module.exports = {
    apiSuccessResponse,
    apiFailedResponse
};