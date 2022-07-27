"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.ErrorHandler = void 0;
const customErrors_1 = require("../../infra/customErrors");
class ErrorHandler extends Error {
    constructor(statusCode, errorType, message) {
        super();
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.message = message;
    }
}
exports.ErrorHandler = ErrorHandler;
const handleError = (err, req, res, next) => {
    const { statusCode, errorType, message } = err;
    const returnCustomError = customErrors_1.customErrors[err.message] ||
        customErrors_1.customErrors.INTERNAL_SERVER_ERROR;
    const data = err.data ? err.data : message;
    res.status(statusCode ||
        returnCustomError.status ||
        customErrors_1.customErrors.INTERNAL_SERVER_ERROR.status);
    res.send({
        result: 'fail',
        errorType: errorType,
        error: { type: returnCustomError.type, data },
    });
};
exports.handleError = handleError;
