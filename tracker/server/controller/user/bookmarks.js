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
const bookmarks_1 = __importDefault(require("../../db/modules/user/bookmarks"));
const logger_1 = __importDefault(require("../../utils/logger"));
const tag = '/controller/user/bookmarks/';
class Bookmark {
    constructor() {
        this.addBookmark = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'addBookmark';
            const bookmarkInfo = req.body;
            try {
                const bookmarkRes = yield bookmarks_1.default.addBookmark(bookmarkInfo);
                res.status(200).send({
                    result: 'success',
                    data: bookmarkRes,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: bookmarkInfo,
                    msg: 'Fail to add bookmark',
                    error,
                });
            }
        });
        this.getBookmarks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'getBookmarks';
            const userId = req.me.id;
            const page = Number(req.query.page) - 1;
            const folder = req.query.folder;
            try {
                const result = yield bookmarks_1.default.getBookmarks(String(userId), page, folder);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    requireInfo: { id: String(userId), page, folder },
                    msg: 'Fail to get bookmarks',
                    error,
                });
            }
        });
        this.deleteBookmark = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'deleteBookmark';
            const userId = req.me.id;
            const bookmarkId = req.body.bookmarkId.split('_')[1];
            try {
                const result = bookmarks_1.default.deleteBookmark(userId, bookmarkId);
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    msg: 'Fail to delete bookmark',
                    error,
                });
            }
        });
        this.deleteBookFold = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _tag = tag + 'deleteBookFold';
            try {
                const userId = req.me.id;
                const result = yield bookmarks_1.default.deleteBookFold(Object.assign({ userId }, req.body));
                res.status(200).send({
                    result: 'success',
                    data: result,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: _tag,
                    msg: 'Fail to delete bookmark folder',
                    error,
                });
            }
        });
    }
}
module.exports = new Bookmark();
