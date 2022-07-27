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
const watchLater_1 = __importDefault(require("../../db/modules/user/watchLater"));
const logger_1 = __importDefault(require("../../utils/logger"));
const tag = '/controller/user/watchLater';
class watchLater {
    constructor() {
        this.addWatchLater = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = 'addWatchLater';
            try {
                const watchLater = req.body;
                const watchLaterRes = yield watchLater_1.default.addWatchLater(watchLater);
                res.status(200).send({
                    result: 'success',
                    data: watchLaterRes,
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
        this.getWatchLater = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = 'getWatchLater';
            const id = req.me.id;
            const page = Number(req.query.page) - 1;
            try {
                const result = yield watchLater_1.default.getWatchLater(id, page);
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
        this.deleteWatchLater = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = 'deleteWatchLater';
            try {
                const result = watchLater_1.default.deleteWatchLater(req.me.id, req.body.watchLaterId);
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
module.exports = new watchLater();
