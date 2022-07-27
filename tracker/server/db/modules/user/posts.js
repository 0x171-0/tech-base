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
class PostsDb {
    constructor() {
        this.addPost = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.UserModel.findOne({
                    _id: new mongodb_1.ObjectId(info.userId),
                });
                if (!user)
                    throw new Error(customErrors_1.customErrors.USER_NOT_FOUND.type);
                const post = {
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
                    post.folder = info.folderNew;
                    user.posts_folder ? user.posts_folder : (user.posts_folder = []);
                    user.posts_folder.push(info.folderNew);
                    user.posts_folder = [...new Set(user.posts_folder)];
                }
                else if (info.folder) {
                    post.folder = info.folder;
                }
                user.posts.push(post);
                const updated = yield user.save();
                const followersIdArr = [];
                if (user.followers) {
                    user.followers.forEach((follower) => {
                        followersIdArr.push(follower._id);
                    });
                }
                const resFollow = yield UserModel_1.UserModel.find({
                    _id: {
                        $in: followersIdArr,
                    },
                });
                const notice = {
                    news_id: info._id,
                    publisher: info.publisher,
                    date: info.date,
                    title: info.title,
                    href: info.href,
                    img: info.img,
                    comment_date: info.commentDate,
                    comment_title: info.commentTitle,
                    comment: info.comment,
                };
                const updatedFollow = [];
                resFollow.forEach((e) => e.notice.push(notice));
                resFollow.forEach((e) => __awaiter(this, void 0, void 0, function* () {
                    const update = yield e.save();
                    updatedFollow.push(update);
                }));
                return [updated, updatedFollow];
            }
            catch (error) {
                throw error;
            }
        });
        this.getPosts = (id, page, folder) => __awaiter(this, void 0, void 0, function* () {
            try {
                let query;
                let select = '';
                if (folder === 'All' || folder === 'Default') {
                    query = {
                        _id: new mongodb_1.ObjectId(id),
                    };
                    select = 'posts -_id';
                }
                else {
                    query = {
                        _id: new mongodb_1.ObjectId(id),
                        'posts.folder': folder,
                    };
                    select = 'posts.$ -_id';
                }
                const posts = (yield UserModel_1.UserModel.find(query, select)
                    .limit(13)
                    .skip(12 * page)
                    .sort('comment_date'))[0];
                const result = {
                    posts: null,
                    nextPage: null,
                };
                let nextPage = null;
                if (posts) {
                    if (posts.posts[12])
                        nextPage = page + 2;
                    if (posts.posts.length == 13)
                        posts.posts.pop();
                    result.posts = posts.posts;
                }
                result.nextPage = nextPage;
                return result;
            }
            catch (error) {
                throw error;
            }
        });
        this.deletePost = (userId, postId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield UserModel_1.UserModel.updateOne({
                    'posts._id': postId,
                }, {
                    $pull: {
                        posts: {
                            _id: postId,
                        },
                    },
                });
                return result;
            }
            catch (error) {
                throw error;
            }
        });
        this.deletePostFold = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, folder } = info;
                const result = yield UserModel_1.UserModel.updateOne({
                    _id: userId,
                }, {
                    $pull: {
                        posts: {
                            folder: folder,
                        },
                        posts_folder: folder,
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
module.exports = new PostsDb();
