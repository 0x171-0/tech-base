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
class HistoryDb {
    constructor() {
        this.getHistory = (id, page) => __awaiter(this, void 0, void 0, function* () {
            try {
                const histories = (yield UserModel_1.UserModel.find({
                    _id: new mongodb_1.ObjectId(id),
                }, 'history -_id')
                    .limit(7)
                    .skip(6 * page)
                    .sort('brose_date'))[0];
                return histories;
            }
            catch (error) {
                throw error;
            }
        });
        this.addHistory = (info) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield UserModel_1.UserModel.updateOne({
                    _id: new mongodb_1.ObjectId(info.userId),
                    'history._id': info._id,
                }, {
                    $set: {
                        'history.0.brose_date': info.broseDate,
                    },
                });
                if (updated.nModified == 0) {
                    const histories = yield UserModel_1.UserModel.findOne({
                        _id: new mongodb_1.ObjectId(info.userId),
                    });
                    const history = {
                        _id: info._id,
                        brose_date: info.broseDate,
                        date: info.date,
                        publisher: info.publisher,
                        title: info.title,
                        href: info.href,
                        content: info.content,
                        tags: info.tags,
                    };
                    histories.history.push(history);
                    const addUpdated = yield histories.save();
                    return addUpdated;
                }
                return updated;
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteHistory = (userId, historyId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const histories = yield UserModel_1.UserModel.updateOne({
                    'history._id': historyId,
                }, {
                    $pull: {
                        history: {
                            _id: historyId,
                        },
                    },
                });
                return histories;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new HistoryDb();
