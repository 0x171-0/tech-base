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
const follow_1 = __importDefault(require("../../db/modules/user/follow"));
const logger_1 = __importDefault(require("../../utils/logger"));
const tag = '/controller/user/follow/';
class Follow {
    constructor() {
        this.follow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'follow';
            try {
                const result = yield follow_1.default.follow(req.body);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: req.body,
                    msg: 'Fail to add follow',
                    error,
                });
            }
        });
        this.getFollow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'getFollow';
            const id = req.me.id;
            const page = Number(req.query.page) - 1;
            try {
                const result = yield follow_1.default.getFollow(id, page);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: req.query,
                    msg: 'Fail to get follow',
                    error,
                });
            }
        });
        this.deleteFollow = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'deleteFollow';
            try {
                const { noticeID } = req.body;
                const result = yield follow_1.default.deleteFollow(req.me.id, noticeID);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: req.body,
                    msg: 'Fail to delete Follow',
                    error,
                });
            }
        });
    }
}
module.exports = new Follow();
