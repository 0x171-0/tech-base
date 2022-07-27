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
const posts_1 = __importDefault(require("../../db/modules/user/posts"));
const logger_1 = __importDefault(require("../../utils/logger"));
const tag = '/controller/user/posts/';
class Posts {
    constructor() {
        this.addPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'addPost';
            const postInfo = req.body;
            try {
                const postRes = yield posts_1.default.addPost(postInfo);
                res.status(200).send({
                    result: 'success',
                    data: postRes,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: postInfo,
                    error,
                });
            }
        });
        this.getPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'getPosts';
            const userId = req.me.id;
            const page = Number(req.query.page) - 1;
            const folder = req.query.folder;
            try {
                const result = yield posts_1.default.getPosts(userId, page, folder);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: { id: userId, page, folder },
                    error,
                });
            }
        });
        this.deletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'deletePost';
            const userId = req.body.userId;
            const postId = req.body.postId.split('_')[1];
            try {
                const result = yield posts_1.default.deletePost(userId, postId);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: { userId, postId },
                    error,
                });
            }
        });
        this.deletePostFold = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'deletePostFold';
            try {
                const result = yield posts_1.default.deletePostFold(req.body);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: req.body,
                    error,
                });
            }
        });
    }
}
module.exports = new Posts();
