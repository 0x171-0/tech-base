"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserModelSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const Brose = new mongoose_2.Schema({
    _id: String,
    brose_date: Date,
    date: Date,
    publisher: String,
    title: String,
    href: String,
    content: String,
    tags: Array,
}, {
    strict: false,
});
const UserComment = new mongoose_2.Schema({
    content_id: String,
    date: Date,
    emoji: String,
    comment: String,
    title: String,
}, {
    strict: false,
});
const Bookmark = new mongoose_2.Schema({
    news_id: String,
    folder: String,
    publisher: String,
    date: Date,
    title: String,
    href: String,
    img: String,
    content: String,
    tags: Array,
    comment_date: Date,
    comment_title: String,
    comment: String,
}, {
    strict: false,
});
const Followers = new mongoose_2.Schema({
    _id: String,
    name: String,
}, {
    strict: false,
});
exports.UserModelSchema = new mongoose_2.Schema({
    name: String,
    email: String,
    password: String,
    picture: String,
    intro: String,
    follow: [Followers],
    notice: [Bookmark],
    followers: [Followers],
    access_token: String,
    access_expired: Number,
    login_at: Date,
    history: [Brose],
    bookmarks: [Bookmark],
    books_folder: Array,
    posts: [Bookmark],
    posts_folder: Array,
    watch_later: [Brose],
    comment: [UserComment],
    role: String,
}, {
    strict: false,
});
exports.UserModel = mongoose_1.default.model('user', exports.UserModelSchema);
