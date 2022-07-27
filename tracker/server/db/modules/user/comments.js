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
const NewsModel_1 = require("../../models/NewsModel");
const { ObjectId } = require('mongodb');
class CommentsDb {
    constructor() {
        this.getSumEmoji = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, contentId } = info;
                const userEmoji = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$content',
                    },
                    {
                        $match: {
                            'content._id': ObjectId(contentId),
                        },
                    },
                    {
                        $unwind: '$content.emoji',
                    },
                    {
                        $match: {
                            'content.emoji.user_id': userId,
                        },
                    },
                    {
                        $group: {
                            _id: {
                                user: '$content.emoji.user_id',
                                emoji: '$content.emoji.emoji',
                            },
                            count: {
                                $sum: '$content.emoji.count',
                            },
                        },
                    },
                ]);
                const totalEmoji = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$content',
                    },
                    {
                        $match: {
                            'content._id': ObjectId(contentId),
                        },
                    },
                    {
                        $unwind: '$content.emoji',
                    },
                    {
                        $group: {
                            _id: {
                                emoji: '$content.emoji.emoji',
                            },
                            count: {
                                $sum: '$content.emoji.count',
                            },
                        },
                    },
                ]);
                const result = {
                    userEmoji: userEmoji,
                    totalEmoji: totalEmoji,
                };
                return result;
            }
            catch (error) {
                throw error;
            }
        });
        this.toggleEmoji = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { intent } = info;
                if (!intent) {
                    return yield this.addEmoji(info);
                }
                else {
                    return yield this.deleteEmoji(info);
                }
            }
            catch (error) {
                throw error;
            }
        });
        this.addEmoji = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { contentId, date, emoji, userId, userName } = info;
                yield NewsModel_1.NewsModel.updateOne({
                    'content._id': contentId,
                }, {
                    $push: {
                        'content.$.emoji': {
                            _id: userName + emoji,
                            date: date,
                            user_id: userId,
                            user_name: userName,
                            emoji: emoji,
                            count: 1,
                        },
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteEmoji = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { emoji, userName } = info;
                return yield NewsModel_1.NewsModel.updateOne({
                    'content.emoji._id': userName + emoji,
                }, {
                    $pull: {
                        'content.$.emoji': {
                            _id: userName + emoji,
                        },
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
        this.saveComment = (userId, userName, contentId, comment, date, picture) => __awaiter(this, void 0, void 0, function* () {
            try {
                const contentIdTrue = contentId.slice(3);
                const result = yield NewsModel_1.NewsModel.updateOne({
                    'content._id': contentIdTrue,
                }, {
                    $push: {
                        'content.$.comment': {
                            date: date,
                            user: [userId, userName],
                            comment: comment,
                            picture: picture,
                        },
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
        this.findComment = (contentId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const commentArr = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$content',
                    },
                    {
                        $unwind: '$content.comment',
                    },
                    {
                        $match: {
                            'content._id': ObjectId(contentId),
                        },
                    },
                    {
                        $group: {
                            _id: '$content.comment',
                        },
                    },
                ]);
                return commentArr;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new CommentsDb();
