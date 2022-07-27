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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BBCCrawler = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const config_1 = __importDefault(require("config"));
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
const crawlerBase_1 = require("./crawlerBase");
const NewsModel_1 = require("../db/models/NewsModel");
class BBCCrawler extends crawlerBase_1.Crawler {
    constructor(nlp, db) {
        super(nlp, db);
        this.publisher = 'BBC';
        this.tag = '/crawler/BBC';
        this.dailyNewsList = [];
    }
    crawlNewsList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(config_1.default.get('crawler.bbc.newsListUrl'));
                const $ = cheerio_1.default.load(data);
                const headLineStories = $('a.gs-c-promo-heading.gs-o-faux-block-link__overlay-link' +
                    '.gel-pica-bold.nw-o-link-split__anchor');
                const headLineStoriesArr = [];
                headLineStories.each((index, value) => {
                    const hrefArrH = $(value).attr('href');
                    if (!hrefArrH || hrefArrH.split('/')[2].split('-')[0] !== 'technology')
                        return;
                    headLineStoriesArr.push(hrefArrH);
                });
                this.dailyNewsList = [...new Set(headLineStoriesArr)];
                console.log('this.dailyNewsList ->', this.dailyNewsList);
                yield this.nlp.init();
            }
            catch (error) {
                logger_1.default.error({
                    tag: this.tag,
                    msg: 'Fail to crawl the news list',
                    error,
                });
                return;
            }
        });
    }
    crawlNews(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let analyzedResult = {};
            const href = config_1.default.get('crawler.bbc.baseNewsUrl') + url;
            try {
                if (yield this.isNewsExist(href))
                    return;
                const $ = yield this._fetchHTMLOfNews(href);
                const newsDate = $('header').find('time').attr('datetime');
                const title = $('h1').text().trim();
                const newsOriginParagraphs = $('.e1sbfw0p0  p');
                if (!newsDate || !newsOriginParagraphs || !title) {
                    console.log('The Content is Not News.');
                    return;
                }
                const paragraphsArr = [];
                let contentString = title.toLowerCase();
                yield newsOriginParagraphs.each((index, value) => {
                    const text = $(value).text();
                    if (text.charAt(0) === '<') {
                        return;
                    }
                    contentString = contentString + text;
                    paragraphsArr.push({
                        content: text,
                    });
                });
                const { score, comparative, positive, negative, calculation, } = yield this.nlp.analyzeSentiment(contentString);
                const { terms, behaviors, tags } = yield this.nlp.analyzeContent(contentString);
                analyzedResult = {
                    publisher: this.publisher,
                    date: moment_1.default(new Date(newsDate), 'MMM Do YY'),
                    title,
                    href,
                    tags,
                    content: paragraphsArr,
                    score,
                    comparative,
                    positive,
                    negative,
                    terms,
                    behaviors,
                    portion: negative.length / (negative.length + positive.length),
                    calculation,
                };
                yield NewsModel_1.NewsModel.create(analyzedResult);
                console.log('analyzedResult->', analyzedResult);
                return analyzedResult;
            }
            catch (error) {
                logger_1.default.error({
                    tag: this.tag,
                    msg: 'Fail to crawl the news',
                    error,
                    href: analyzedResult.href,
                });
                throw error;
            }
        });
    }
    validateNewsContent($) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    _fetchHTMLOfNews(href) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get(href);
            return cheerio_1.default.load(data);
        });
    }
}
exports.BBCCrawler = BBCCrawler;
