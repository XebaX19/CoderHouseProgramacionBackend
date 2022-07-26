class CustomError {
    constructor(statusCode, description, errorDetails) {
        this.statusCode = statusCode;
        this.message = description;
        this.details = errorDetails;
    }
}

module.exports = CustomError;