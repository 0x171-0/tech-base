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
const mongodb_1 = require("mongodb");
const UserModel_1 = require("../../models/UserModel");
const customErrors_1 = require("../../../infra/customErrors");
class BookmarkDb {
    constructor() {
        this.addBookmark = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.UserModel.findOne({
                    _id: new mongodb_1.ObjectId(info.userId),
                });
                if (!user)
                    throw new Error(customErrors_1.customErrors.USER_NOT_FOUND.type);
                const bookmark = {
                    news_id: info._id,
                    publisher: info.publisher,
                    date: info.date,
                    title: info.title,
                    href: info.href,
                    img: info.img,
                    content: info.content,
                    tags: info.tags,
                    comment_date: info.commentDate,
                    comment_title: info.commentTitle,
                    comment: info.comment,
                    folder: '',
                };
                if (info.folderNew) {
                    bookmark.folder = info.folderNew;
                    user.books_folder ? user.books_folder : (user.books_folder = []);
                    user.books_folder.push(info.folderNew);
                    user.books_folder = [...new Set(user.books_folder)];
                }
                else if (info.folder) {
                    bookmark.folder = info.folder;
                }
                user.bookmarks ? user.bookmarks : (user.bookmarks = []);
                user.bookmarks.push(bookmark);
                const updated = yield user.save();
                return updated;
            }
            catch (error) {
                throw error;
            }
        });
        this.getBookmarks = (id, page, folder) => __awaiter(this, void 0, void 0, function* () {
            try {
                let query;
                let select = '';
                if (folder == 'All') {
                    query = {
                        _id: new mongodb_1.ObjectId(id),
                    };
                    select = 'bookmarks -_id';
                }
                else {
                    query = {
                        _id: new mongodb_1.ObjectId(id),
                        'bookmarks.folder': folder,
                    };
                    select = 'bookmarks.$ -_id';
                }
                const user = (yield UserModel_1.UserModel.find(query, select)
                    .limit(13)
                    .skip(12 * page)
                    .sort('comment_date'))[0];
                let nextPage = null;
                let result = {};
                if (user) {
                    user.bookmarks ? user.bookmarks : (user.bookmarks = []);
                    if (user.bookmarks[12])
                        nextPage = page + 2;
                    if (user.bookmarks.length == 13)
                        user.bookmarks.pop();
                    result.bookmarks = user.bookmarks;
                }
                else {
                    result.posts = null;
                }
                return result;
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteBookmark = (userId, bookmarkId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield UserModel_1.UserModel.updateOne({
                    'bookmarks._id': bookmarkId,
                }, {
                    $pull: {
                        bookmarks: {
                            _id: bookmarkId,
                        },
                    },
                });
                return result;
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteBookFold = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, folder } = info;
                const result = yield UserModel_1.UserModel.updateOne({
                    _id: userId,
                }, {
                    $pull: {
                        bookmarks: {
                            folder: folder,
                        },
                        books_folder: folder,
                    },
                });
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new BookmarkDb();
