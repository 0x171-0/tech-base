"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const Tags = new mongoose_2.Schema({
    tags: String,
    count: Number,
});
const userSubComment = new mongoose_2.Schema({
    date: Date,
    comment: String,
    user: String,
    like: Array,
}, {
    strict: false,
});
const userComment = new mongoose_2.Schema({
    date: Date,
    comment: String,
    user: Array,
    sub_comment: [userSubComment],
}, {
    strict: false,
});
const Classifier = new mongoose_2.Schema({
    label: String,
    value: Number,
});
const Sentiment = new mongoose_2.Schema({
    word: String,
    size: Number,
});
const Emoji = new mongoose_2.Schema({
    _id: String,
    date: Date,
    emoji: Number,
    count: Number,
    user_id: String,
    user_name: String,
}, {
    strict: false,
});
const Content = new mongoose_2.Schema({
    content: String,
    emoji: [Emoji],
    comment: [userComment],
}, {
    strict: false,
});
const NewsModelSchema = new mongoose_2.Schema({
    publisher: String,
    date: Date,
    title: {
        type: String,
        unique: true,
        index: true,
    },
    href: {
        type: String,
        unique: true,
    },
    img: String,
    tags: [Tags],
    content: [Content],
    score: Number,
    comparative: Number,
    calculation: Array,
    positive: [Sentiment],
    negative: [Sentiment],
    portion: Number,
    terms: [Sentiment],
    behaviors: [Sentiment],
    category: [Classifier],
}, {
    strict: false,
});
exports.NewsModel = mongoose_1.default.model('news', NewsModelSchema);
