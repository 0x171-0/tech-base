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
class ImagesDb {
    constructor() {
        this.uploadImage = (userId, imgUrl) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield UserModel_1.UserModel.updateOne({
                    _id: new mongodb_1.ObjectId(userId),
                }, {
                    $set: {
                        picture: imgUrl,
                    },
                });
                return updated;
            }
            catch (error) {
                throw error;
            }
        });
        this.deleteImg = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteUrl = yield UserModel_1.UserModel.find({
                    _id: new mongodb_1.ObjectId(userId),
                }, 'picture');
                return deleteUrl;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new ImagesDb();
