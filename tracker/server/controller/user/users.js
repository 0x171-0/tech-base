"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const users_1 = __importDefault(require("../../db/modules/user/users"));
const errorHandler_1 = require("../../middleWares/errorHandler");
const errorType_1 = require("../../infra/enums/errorType");
const validator = require('validator');
const config_1 = __importDefault(require("config"));
const expire = config_1.default.get('token.expireTime'); // 30 days by seconds
const tag = '/controller/user/users';
const logger_1 = __importDefault(require("../../utils/logger"));
class User {
    constructor() {
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'signUp';
            let { name, email, password } = req.body;
            try {
                if (!validator.isEmail(email)) {
                    throw new errorHandler_1.ErrorHandler(400, errorType_1.ErrorType.ValidationError, 'Request Error: Invalid email format');
                }
                name = validator.escape(name);
                const { access_token, loginAt, user } = yield users_1.default.signUp(name, email, password);
                if (!user) {
                    throw new errorHandler_1.ErrorHandler(500, errorType_1.ErrorType.DatabaseError, 'Database Query Error');
                }
                res.status(200).send({
                    result: 'success',
                    data: {
                        access_token: access_token,
                        access_expired: config_1.default.get('token.expireTime'),
                        login_at: loginAt,
                        id: user.id,
                        provider: user.provider,
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                        posts_folder: user.posts_folder,
                        books_folder: user.books_folder,
                    },
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: { name, email, password, expire },
                    msg: 'Fail to sign up',
                    error,
                });
            }
        });
        this.nativeSignIn = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'nativeSignIn';
            try {
                if (!email || !password) {
                    throw new errorHandler_1.ErrorHandler(400, errorType_1.ErrorType.PermissionError, 'Request Error: email and password are required.');
                }
                return yield users_1.default.nativeSignIn(email, password);
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: { email, password },
                    error,
                });
                throw error;
            }
        });
        this.signIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'signIn';
            const data = req.body;
            let result;
            try {
                switch (data.provider) {
                    case 'native':
                        result = yield this.nativeSignIn(data.email, data.password);
                        break;
                    default:
                        result = {
                            error: 'Wrong Request',
                        };
                }
                if (result.error) {
                    throw new errorHandler_1.ErrorHandler(400, errorType_1.ErrorType.PermissionError, result.error);
                }
                const { access_token, loginAt, user } = result;
                if (!user) {
                    throw new errorHandler_1.ErrorHandler(500, errorType_1.ErrorType.DatabaseError, 'Database Query Error');
                }
                res.status(200).send({
                    result: 'success',
                    data: {
                        access_token: access_token,
                        access_expired: config_1.default.get('token.expireTime'),
                        login_at: loginAt,
                        id: user.id,
                        provider: user.provider,
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                        posts_folder: user.posts_folder,
                        books_folder: user.books_folder,
                    },
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: data,
                    msg: 'Fail to signIn',
                    error,
                });
                next(error);
            }
        });
        this.getUserProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'getUserProfile';
            const access_token = req.get('Authorization');
            try {
                if (!access_token) {
                    throw new errorHandler_1.ErrorHandler(400, errorType_1.ErrorType.PermissionError, 'Wrong Request: authorization is required.');
                }
                const profile = yield users_1.default.getUserProfile(access_token);
                if (profile.error) {
                    res.status(403).send({
                        error: profile.error,
                    });
                    return;
                }
                else {
                    res.status(200).send({
                        result: 'success',
                        data: profile,
                    });
                }
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: { access_token },
                    error,
                });
                next(error);
            }
        });
        this.getFolders = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'getFolders';
            const userId = req.me.id;
            const userFolders = yield users_1.default.getFolders(userId);
            try {
                res.status(200).send({
                    result: 'success',
                    data: userFolders,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: { userId, userFolders },
                    error,
                });
                next(error);
            }
        });
        this.publicInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'publicInfo';
            const userId = req.query.userId;
            try {
                let result = yield users_1.default.publicInfo(userId);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: { userId },
                    msg: 'Fail to get public info',
                    error,
                });
                next(error);
            }
        });
    }
}
module.exports = new User();
