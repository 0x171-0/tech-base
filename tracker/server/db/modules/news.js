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
const NewsModel_1 = require("../models/NewsModel");
const config_1 = __importDefault(require("config"));
const init_1 = require("../../db/init");
const safeAwait_1 = require("../../utils/safeAwait");
const tag = 'server/db/modules/news';
class NewsDb {
    constructor() {
        this.oneTopTags = (tag) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield NewsModel_1.NewsModel.aggregate([
                    {
                        $match: {
                            _id: Object(tag),
                        },
                    },
                    {
                        $unwind: '$tags',
                    },
                    {
                        $sort: {
                            'tags.score': -1,
                        },
                    },
                    {
                        $limit: 50,
                    },
                    {
                        $group: {
                            _id: '$_id',
                            tags: {
                                $push: '$tags',
                            },
                        },
                    },
                ]).then(function (toptags) {
                    return toptags[0].tags;
                });
            }
            catch (error) {
                throw error;
            }
        });
        this.sumTagDay = (tag) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tagDayNum = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$tags',
                    },
                    {
                        $match: {
                            'tags.tags': tag,
                        },
                    },
                    {
                        $group: {
                            _id: {
                                day: '$date',
                                tag: '$tags.tags',
                            },
                            count: {
                                $sum: '$tags.count',
                            },
                        },
                    },
                    {
                        $sort: {
                            '_id.day': -1,
                        },
                    },
                ]).limit(7); // limit days
                return tagDayNum;
            }
            catch (error) {
                throw error;
            }
        });
        this.sumTagsDay = (tags, newsDate) => __awaiter(this, void 0, void 0, function* () {
            try {
                const last7Date = new Date(newsDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                const tagDayNum = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$tags',
                    },
                    {
                        $match: {
                            'tags.tags': {
                                $in: tags,
                            },
                            date: {
                                $gt: last7Date,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                day: '$date',
                                tag: '$tags.tags',
                            },
                            count: {
                                $sum: '$tags.count',
                            },
                        },
                    },
                    {
                        $sort: {
                            '_id.day': -1,
                        },
                    },
                ]);
                return tagDayNum;
            }
            catch (error) {
                throw error;
            }
        });
        this.sumTagWeek = (tag) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tagDayNum = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$tags',
                    },
                    {
                        $match: {
                            'tags.tags': tag,
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: {
                                    $year: '$date',
                                },
                                month: {
                                    $month: '$date',
                                },
                                week: {
                                    $week: '$date',
                                },
                                tag: '$tags.tags',
                            },
                            count: {
                                $sum: '$tags.count',
                            },
                        },
                    },
                    {
                        $sort: {
                            '_id.year': -1,
                            '_id.month': -1,
                        },
                    },
                ]).limit(8); // limit days
                return tagDayNum;
            }
            catch (error) {
                throw error;
            }
        });
        this.sumTagsWeek = (tags, endDate) => __awaiter(this, void 0, void 0, function* () {
            try {
                const last8Week = new Date(endDate.getTime() - 49 * 24 * 60 * 60 * 1000);
                const tagDayNum = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$tags',
                    },
                    {
                        $match: {
                            'tags.tags': {
                                $in: tags,
                            },
                            date: {
                                $gt: last8Week,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: {
                                    $year: '$date',
                                },
                                month: {
                                    $month: '$date',
                                },
                                week: {
                                    $week: '$date',
                                },
                                tag: '$tags.tags',
                            },
                            count: {
                                $sum: '$tags.count',
                            },
                        },
                    },
                    {
                        $sort: {
                            '_id.year': -1,
                            '_id.month': -1,
                        },
                    },
                ]).limit(8);
                return tagDayNum;
            }
            catch (error) {
                throw error;
            }
        });
        this.sumTagMonth = (tag) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tagDayNum = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$tags',
                    },
                    {
                        $match: {
                            'tags.tags': tag,
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: {
                                    $year: '$date',
                                },
                                month: {
                                    $month: '$date',
                                },
                                tag: '$tags.tags',
                            },
                            count: {
                                $sum: '$tags.count',
                            },
                        },
                    },
                    {
                        $sort: {
                            '_id.year': -1,
                            '_id.month': -1,
                        },
                    },
                ]).limit(13);
                return tagDayNum;
            }
            catch (error) {
                throw error;
            }
        });
        this.sumTagsMonth = (tags, endDate) => __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Month = new Date(endDate.getTime() - 360 * 24 * 60 * 60 * 1000);
                const tagDayNum = yield NewsModel_1.NewsModel.aggregate([
                    {
                        $unwind: '$tags',
                    },
                    {
                        $match: {
                            'tags.tags': {
                                $in: tags,
                            },
                            date: {
                                $gt: last12Month,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: {
                                    $year: '$date',
                                },
                                month: {
                                    $month: '$date',
                                },
                                tag: '$tags.tags',
                            },
                            count: {
                                $sum: '$tags.count',
                            },
                        },
                    },
                    {
                        $sort: {
                            '_id.year': -1,
                            '_id.month': -1,
                        },
                    },
                ]);
                return tagDayNum;
            }
            catch (error) {
                throw error;
            }
        });
        this.allTopTags = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const nowDate = new Date();
                const newsTagsArr = yield NewsModel_1.NewsModel.find({
                    date: {
                        $gte: new Date(nowDate.getTime() - 21 * 24 * 60 * 60 * 1000),
                    },
                }).select('tags -_id');
                let mergeRes = yield this.mergeAllTags(newsTagsArr);
                if (!mergeRes) {
                    const newsTagsArr = yield NewsModel_1.NewsModel.find()
                        .select('tags -_id')
                        .sort({
                        date: -1,
                    })
                        .limit(30);
                    mergeRes = yield this.mergeAllTags(newsTagsArr);
                }
                const sortAll = mergeRes.sort(function (tagA, tagB) {
                    if (Number(tagA[1]) > Number(tagB[1]))
                        return -1;
                    if (Number(tagB[1]) > Number(tagA[1]))
                        return 1;
                    return 0;
                });
                const chartData = yield sortAll
                    .map((e) => {
                    return {
                        x: e[0],
                        value: e[1],
                    };
                })
                    .slice(0, 99);
                if (chartData) {
                    const [_error, data] = yield safeAwait_1.safeAwait(init_1.redisClient.setex('allTopTags', config_1.default.get('redis.expireTime'), JSON.stringify(chartData)), tag + '/allTopTags/redis');
                }
                return chartData;
            }
            catch (error) {
                throw error;
            }
        });
        this.mergeAllTags = (newsTagsArr) => __awaiter(this, void 0, void 0, function* () {
            try {
                const merge = {};
                newsTagsArr.forEach((basket) => {
                    basket.tags.forEach((tagInfo) => {
                        if (merge[tagInfo.tags]) {
                            merge[tagInfo.tags] += Number(tagInfo.count);
                        }
                        else {
                            merge[tagInfo.tags] = Number(tagInfo.count);
                        }
                    });
                });
                const tags = Object.entries(merge);
                return tags;
            }
            catch (error) {
                throw error;
            }
        });
    }
    gatNewsList(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { keywords, startTime, endTime, page = 0, tag } = opt;
                const findCondition = {
                    date: {
                        $gte: startTime,
                    },
                };
                if (endTime)
                    findCondition.date.$lte = endTime;
                if (tag)
                    findCondition['tags.tags'] = tag;
                if (keywords) {
                    findCondition.$text = {};
                    findCondition.$text.$search = keywords;
                }
                const news = yield NewsModel_1.NewsModel.find(findCondition)
                    .sort({
                    date: -1,
                })
                    .limit(7)
                    .skip(6 * page);
                let nextPage = null;
                if (news[6])
                    nextPage = page + 2;
                if (news.length == 7)
                    news.pop();
                const searchNews = {
                    news: news,
                    nextPage: nextPage,
                };
                const [_error, data] = yield safeAwait_1.safeAwait(init_1.redisClient.setex(`searchByTag_${tag}_${startTime}_${endTime}_${page}`, config_1.default.get('redis.expireTime'), JSON.stringify(searchNews)), tag + '/gatNewsList/redis');
                return searchNews;
            }
            catch (error) {
                throw error;
            }
        });
    }
    searchNewsDetail(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, href } = opt;
                const findCondition = {};
                if (title)
                    findCondition.title = title;
                if (href)
                    findCondition.title = href;
                return (yield NewsModel_1.NewsModel.find(findCondition))[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new NewsDb();
