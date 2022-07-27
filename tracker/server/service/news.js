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
const news_1 = __importDefault(require("../db/modules/news"));
const errorHandler_1 = require("../middleWares/errorHandler");
const errorType_1 = require("../infra/enums/errorType");
const moment_1 = __importDefault(require("moment"));
const formatTime_1 = __importDefault(require("../utils/formatTime"));
const tag = '/service/news/';
class NewsService {
    constructor() {
        this.getTagsByTime = (opt) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeSpan, topTags, newsDate } = opt;
                let timeSpanArr;
                let timeSpanData;
                const endDate = new Date(newsDate);
                switch (timeSpan) {
                    case 'day':
                        timeSpanArr = yield formatTime_1.default.forMatDay(7, endDate);
                        timeSpanData = yield news_1.default.sumTagsDay(topTags, endDate);
                        return yield this.formatTagsTimeSpan('day', topTags, timeSpanArr, timeSpanData);
                    case 'week':
                        timeSpanArr = yield formatTime_1.default.forMatWeek(7, endDate);
                        timeSpanData = yield news_1.default.sumTagsWeek(topTags, endDate);
                        return yield this.formatTagsTimeSpan('week', topTags, timeSpanArr, timeSpanData);
                    case 'month':
                        timeSpanArr = yield formatTime_1.default.forMatMonth(7, endDate);
                        timeSpanData = yield news_1.default.sumTagsMonth(topTags, endDate);
                        return yield this.formatTagsTimeSpan('month', topTags, timeSpanArr, timeSpanData);
                }
            }
            catch (error) {
                throw error;
            }
        });
        this.formatTagsTimeSpan = (timeType, topTags, timeSpanArr, timeSpanData) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (timeSpanData.length === 0) {
                    throw new errorHandler_1.ErrorHandler(403, errorType_1.ErrorType.DatabaseError, 'Search no news');
                }
                let isSameTime;
                topTags.forEach((tag, tagIndex) => {
                    timeSpanData.forEach((news) => {
                        if (news._id.tag == tag) {
                            timeSpanArr.forEach((time, timeIndex) => {
                                switch (timeType) {
                                    case 'day':
                                        isSameTime = moment_1.default(news._id.day)
                                            .format('YYYY-MM-DD')
                                            .slice(0, 10);
                                        break;
                                    case 'week':
                                        isSameTime = news._id.year + ' w' + news._id.week;
                                        break;
                                    case 'month':
                                        isSameTime = news._id.year + '/' + news._id.month;
                                        break;
                                }
                                if (time[0] == isSameTime) {
                                    timeSpanArr[timeIndex][tagIndex + 1] = news.count;
                                }
                                else {
                                    timeSpanArr[timeIndex][tagIndex + 1] = timeSpanArr[timeIndex][tagIndex + 1]
                                        ? timeSpanArr[timeIndex][tagIndex + 1]
                                        : 0;
                                }
                            });
                        }
                    });
                });
                return timeSpanArr;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
module.exports = new NewsService();
