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
class FollowDb {
    constructor() {
        this.follow = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, userName, followId, followName } = info;
                return [
                    yield this._addFollowingsToUserList(userId, followId, followName),
                    yield this._addFollowerToUserList(userId, followId, userName),
                ];
            }
            catch (error) {
                throw error;
            }
        });
        this._addFollowingsToUserList = (userId, followId, followName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userFollowing = yield UserModel_1.UserModel.findOne({
                    _id: new mongodb_1.ObjectId(userId),
                }).exec();
                const follow = {
                    _id: followId,
                    name: followName,
                };
                if (!userFollowing)
                    return;
                userFollowing.follow.push(follow);
                const updated = yield userFollowing.save();
            }
            catch (error) {
                throw error;
            }
        });
        this._addFollowerToUserList = (userId, followId, userName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userBeFollowed = yield UserModel_1.UserModel.findOne({
                    _id: new mongodb_1.ObjectId(followId),
                });
                if (!userBeFollowed || !userBeFollowed.followers)
                    return;
                const followers = {
                    _id: userId,
                    name: userName,
                };
                userBeFollowed.followers.push(followers);
                const updatedFollow = yield userBeFollowed.save();
            }
            catch (error) {
                throw error;
            }
        });
        this.getFollow = (id, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (yield UserModel_1.UserModel.find({
                    _id: new mongodb_1.ObjectId(id),
                }, 'notice -_id')
                    .limit(13)
                    .skip(12 * page)
                    .sort('comment_date'))[0];
                let nextPage = null;
                if (user.notice[12])
                    nextPage = page + 2;
                if (user.notice.length == 13)
                    user.notice.pop();
                return { notice: user.notice, nextPage };
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteFollow = (userId, noticeID) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.UserModel.updateOne({
                    'notice._id': noticeID,
                }, {
                    $pull: {
                        notice: {
                            _id: noticeID,
                        },
                    },
                });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new FollowDb();
