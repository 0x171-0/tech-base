"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsync = exports.handleError = exports.ErrorHandler = void 0;
const customErrors_1 = require("../infra/customErrors");
const util_1 = require("util");
class ErrorHandler extends Error {
    constructor(statusCode, errorType, message) {
        super();
        this.statusCode = statusCode;
        this.errorType = errorType;
        this.message = util_1.inspect(message);
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
const wrapAsync = (fn) => {
    const errorCatch = function (req, res, next) {
        fn(req, res, next).catch(next);
    };
    return errorCatch;
};
exports.wrapAsync = wrapAsync;
