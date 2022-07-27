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
const logger_1 = __importDefault(require("../../utils/logger"));
const history_1 = __importDefault(require("../../db/modules/user/history"));
const tag = 'controller/user/history';
class History {
    constructor() {
        this.addHistory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/addHistory';
            try {
                yield history_1.default.addHistory(Object.assign({ userId: req.me.id, userEmail: req.me.email, userName: req.me.name }, history));
                res.status(200).send({
                    result: 'success',
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    error,
                });
                next(error);
            }
        });
        this.getHistory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/getHistory';
            try {
                const userId = req.me.id;
                const page = Number(req.query.page) - 1;
                const result = yield history_1.default.getHistory(String(userId), page);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
        this.deleteHistory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/deleteHistory';
            try {
                const result = history_1.default.deleteHistory(req.me.id, req.body.historyId.split('_')[1]);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
    }
}
module.exports = new History();
