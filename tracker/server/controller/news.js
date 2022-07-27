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
const init_1 = require("../db/init");
const comments_1 = __importDefault(require("../db/modules/user/comments"));
const news_1 = __importDefault(require("../db/modules/news"));
const news_2 = __importDefault(require("../service/news"));
const moment_1 = __importDefault(require("moment"));
const logger_1 = __importDefault(require("../utils/logger"));
const safeAwait_1 = require("../utils/safeAwait");
// Reference: [Mongo DB allow time format] https://www.tutorialkart.com/mongodb/mongodb-date/
const tag = '/controller/news/';
class NewsController {
    constructor() {
        this.getAllTopTags = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/getAllTopTags';
            try {
                res.status(200).send({
                    result: 'success',
                    data: yield news_1.default.allTopTags(),
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
        this.getAnalyzeLineChart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/getAnalyzeLineChart';
            try {
                const timeSpan = req.params.timeSpan;
                const lineTags = req.query.tags.split(',');
                const newsDate = req.query.date;
                res.status(200).send({
                    result: 'success',
                    data: yield news_2.default.getTagsByTime({
                        timeSpan,
                        topTags: lineTags,
                        newsDate,
                    }),
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
        this.getNewsTimeline = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/getNewsTimeline';
            try {
                const startTime = req.query.startTime || '2007-07-07';
                const endTime = req.query.endTime ||
                    moment_1.default().endOf('day').format('YYYY-MM-DD');
                moment_1.default().endOf('day').format('YYYY-MM-DD');
                const sort = req.query.sort;
                const page = Number(req.query.page) - 1;
                res.status(200).send({
                    result: 'success',
                    data: yield news_1.default.gatNewsList({
                        tag: sort,
                        page,
                        startTime,
                        endTime,
                    }),
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
        this.getNewsDetail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/getNewsDetail';
            try {
                const title = decodeURIComponent(req.query.title);
                res.status(200).send({
                    result: 'success',
                    data: yield news_1.default.searchNewsDetail({ title }),
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
        this.searchNews = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/searchNews';
            try {
                const keywords = req.query.search;
                const startTime = req.query.startTime || '2007-07-07';
                const endTime = req.query.endTime ||
                    moment_1.default().endOf('day').format('YYYY-MM-DD');
                const page = Number(req.query.page) - 1;
                res.status(200).send({
                    result: 'success',
                    data: yield news_1.default.gatNewsList({
                        keywords,
                        page,
                        startTime,
                        endTime,
                    }),
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    msg: error.message,
                    error,
                });
                next(error);
            }
        });
        this.getComments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/getComments';
            const search = req.params.search;
            try {
                switch (search) {
                    case 'comment':
                        const comment = req.query.content;
                        const data = yield comments_1.default.findComment(comment);
                        res.status(200).send({
                            result: 'success',
                            data,
                        });
                        break;
                    case 'toggleEmoji':
                        res.status(200).send({
                            result: 'success',
                            data: yield comments_1.default.toggleEmoji(req.body),
                        });
                        break;
                    case 'getSumEmoji':
                        const { userId, contentId } = req.query;
                        res.status(200).send({
                            result: 'success',
                            data: yield comments_1.default.getSumEmoji({
                                userId: userId,
                                contentId: contentId,
                            }),
                        });
                        break;
                    default:
                        res.redirect('./public/timeline.html');
                }
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    msg: error.message,
                    error,
                });
                next(error);
            }
        });
        this.postComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/postComment';
            const search = req.params.search;
            try {
                switch (search) {
                    case 'toggleEmoji':
                        res.status(200).send({
                            result: 'success',
                            data: yield comments_1.default.toggleEmoji(req.body),
                        });
                        break;
                    default:
                        res.redirect('./public/timeline.html');
                }
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
        this.cacheAllTopTags = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/cacheAllTopTags';
            try {
                const [_error, data] = yield safeAwait_1.safeAwait(init_1.redisClient.get(`allTopTags`), tag + '/cacheAllTopTags/redis');
                data
                    ? res
                        .status(200)
                        .send({ result: 'success', data: JSON.parse(String(data)) })
                    : next();
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
        this.cacheNews = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/cacheNews';
            try {
                const startTime = req.query.startTime || '2007-07-07';
                const endTime = req.query.endTime || new Date().setHours(23, 59, 59, 999);
                const sort = req.query.sort;
                const page = Number(req.query.page) - 1;
                if (sort == 'time') {
                    const [_error, data] = yield safeAwait_1.safeAwait(init_1.redisClient.get(`searchByTime_${startTime}_${endTime}_${page}`), tag + '/cacheNews/redis');
                    data
                        ? res
                            .status(200)
                            .send({ result: 'success', data: JSON.parse(String(data)) })
                        : next();
                }
                else {
                    const [_error, data] = yield safeAwait_1.safeAwait(init_1.redisClient.get(`searchByTag_${sort}_${startTime}_${endTime}_${page}`), tag + '/cacheNews/redis');
                    data
                        ? res
                            .status(200)
                            .send({ result: 'success', data: JSON.parse(String(data)) })
                        : next();
                }
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
    }
}
module.exports = new NewsController();
