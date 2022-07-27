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
const mongodb_1 = require("mongodb");
const UserModel_1 = require("../../models/UserModel");
const config_1 = __importDefault(require("config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorHandler_1 = require("../../../middleWares/errorHandler");
const errorType_1 = require("../../../infra/enums/errorType");
const token_1 = __importDefault(require("../../../helpers/token"));
const salt = parseInt(config_1.default.get('bcrypt.salt'));
class UserDb {
    constructor() {
        this.publicInfo = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = (yield UserModel_1.UserModel.find({
                    _id: new mongodb_1.ObjectId(userId),
                }, '_id name picture posts posts_folder intro followers bookmarks'))[0];
                if (!results) {
                    return {
                        error: 'Invalid User ID',
                    };
                }
                else {
                    return {
                        data: {
                            user_id: results._id,
                            name: results.name,
                            picture: results.picture,
                            posts: results.posts,
                            postsFolder: results.posts_folder,
                            intro: results.intro,
                            followers: results.followers,
                            bookmarks: results.bookmarks,
                        },
                    };
                }
            }
            catch (error) {
                throw error;
            }
        });
        this.signUp = (name, email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const emails = yield this.findUserByEmail(email);
                if (emails.length > 0) {
                    throw new errorHandler_1.ErrorHandler(400, errorType_1.ErrorType.ClientError, 'Email Already Exists');
                }
                const loginAt = new Date();
                const access_token = token_1.default.generateToken({ email, loginAt });
                const user = {
                    id: '',
                    provider: 'native',
                    email: email,
                    password: bcrypt_1.default.hashSync(password, salt),
                    name: name,
                    picture: undefined,
                    intro: undefined,
                    access_token: access_token,
                    access_expired: config_1.default.get('token.expireTime'),
                    login_at: loginAt,
                    posts_folder: [],
                    books_folder: [],
                };
                const result = yield UserModel_1.UserModel.create(user);
                user.id = result._id;
                return {
                    access_token,
                    loginAt,
                    user,
                };
            }
            catch (error) {
                throw error;
            }
        });
        this.nativeSignIn = (email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.findUserByEmail(email);
                const user = users[0];
                if (!user) {
                    return {
                        error: 'Email is Wrong',
                    };
                }
                if (!bcrypt_1.default.compareSync(password, String(user.password))) {
                    return {
                        error: 'Password is wrong',
                    };
                }
                const loginAt = new Date();
                const access_token = token_1.default.generateToken({ email, loginAt });
                yield UserModel_1.UserModel.updateOne({
                    _id: user.id,
                }, {
                    access_token: access_token,
                    access_expired: config_1.default.get('token.expireTime'),
                    login_at: loginAt,
                });
                return {
                    access_token,
                    loginAt,
                    user,
                };
            }
            catch (error) {
                throw error;
            }
        });
        this.getUserProfile = (access_token) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = (yield UserModel_1.UserModel.find({ access_token }, {}))[0];
                if (!results) {
                    return {
                        error: 'Invalid Access Token',
                    };
                }
                else {
                    return {
                        userId: results.id,
                        provider: results.provider,
                        name: results.name,
                        email: results.email,
                        picture: results.picture,
                        intro: results.intro,
                    };
                }
            }
            catch (error) {
                throw error;
            }
        });
        this.findUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.UserModel.find({ email });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
        this.getFolders = (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfo = (yield UserModel_1.UserModel.find({ _id: new mongodb_1.ObjectId(userId) }, '_id  books_folder posts_folder followers'))[0];
                if (!userInfo['_id']) {
                    throw new errorHandler_1.ErrorHandler(500, errorType_1.ErrorType.DatabaseError, 'Database Query Error');
                }
                const result = {
                    booksFolder: userInfo.books_folder,
                    postsFolder: userInfo.posts_folder,
                    followers: userInfo.followers,
                };
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new UserDb();
