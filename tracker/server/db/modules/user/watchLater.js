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
class watchLaterDb {
    constructor() {
        this.getWatchLater = (id, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const watchLater = (yield UserModel_1.UserModel.find({
                    _id: new mongodb_1.ObjectId(id),
                }, 'watch_later -_id')
                    .limit(7)
                    .skip(6 * page)
                    .sort('_id'))[0];
                let result = { watchLater: watchLater.watch_later };
                return result;
            }
            catch (error) {
                throw error;
            }
        });
        this.addWatchLater = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, newsId, broseDate, date, title, href, content } = info;
                const updated = yield UserModel_1.UserModel.updateOne({
                    _id: new mongodb_1.ObjectId(info.userId),
                    'watch_later._id': info.newsId,
                }, {
                    $set: {
                        'watch_later.0.brose_date': info.broseDate,
                    },
                });
                if (updated.nModified == 0) {
                    const watchLaters = yield UserModel_1.UserModel.findOne({
                        _id: new mongodb_1.ObjectId(info.userId),
                    });
                    if (!watchLaters)
                        return;
                    const watchLater = {
                        _id: newsId,
                        brose_date: broseDate,
                        date: date,
                        title: title,
                        href: href,
                        content: content,
                    };
                    watchLaters.watch_later.push(watchLater);
                    const addUpdated = yield watchLaters.save();
                    return addUpdated;
                }
                return updated;
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteWatchLater = (userId, watchLaterId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield UserModel_1.UserModel.updateOne({
                    'watch_later._id': watchLaterId,
                }, {
                    $pull: {
                        watch_later: {
                            _id: watchLaterId,
                        },
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
module.exports = new watchLaterDb();
