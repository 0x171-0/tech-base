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
exports.CNNCrawler = void 0;
const config_1 = __importDefault(require("config"));
const moment_1 = __importDefault(require("moment"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = __importDefault(require("../utils/logger"));
const crawlerBase_1 = require("./crawlerBase");
const NewsModel_1 = require("../db/models/NewsModel");
class CNNCrawler extends crawlerBase_1.Crawler {
    constructor(nlp, db) {
        super(nlp, db);
        this.publisher = 'CNN';
        this.tag = '/crawler/CNN';
        this.dailyNewsList = [];
    }
    crawlNewsList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const browser = yield puppeteer_1.default.launch({ headless: true });
                const page = yield browser.newPage();
                yield page.setDefaultNavigationTimeout(0);
                yield page.goto(config_1.default.get('crawler.cnn.newsListUrl'), {
                    waitUntil: ['networkidle2'],
                });
                const hrefArr = yield page.$$eval('a[href*=tech][href*="index.html"]', (options) => options.map((option) => {
                    return option.href.split('https://edition.cnn.com')[1];
                }));
                yield browser.close();
                this.dailyNewsList = [...new Set(hrefArr)];
                console.log('	this.dailyNewsList->', this.dailyNewsList);
                yield this.nlp.init();
            }
            catch (error) {
                logger_1.default.error({
                    tag: this.tag,
                    msg: 'Fail to crawl the news list',
                    error,
                });
                throw error;
            }
        });
    }
    crawlNews(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let analyzedResult = {};
            const href = config_1.default.get('crawler.cnn.baseNewsUrl') + url;
            try {
                if (yield this.isNewsExist(href))
                    return;
                const browser = yield puppeteer_1.default.launch({ headless: true });
                const page = yield browser.newPage();
                yield page.setDefaultNavigationTimeout(0);
                yield page.goto(href, { waitUntil: ['networkidle2'] });
                const title = yield page.$eval('.pg-headline', (el) => el.innerText);
                const newsDate = (yield page.$eval('.update-time', (el) => el.innerText)).split(`) `)[1];
                const newsOriginParagraphs = yield page.$$eval('.zn-body__paragraph', (nodes) => nodes.map((n) => n.innerText));
                yield browser.close();
                if (!newsDate || !title || !newsOriginParagraphs) {
                    console.log('The Content is Not News.');
                    return;
                }
                const paragraphsArr = [];
                let contentString = title.toLowerCase();
                yield newsOriginParagraphs.forEach((paragraphText) => {
                    if (!paragraphText.length)
                        return;
                    contentString += paragraphText;
                    paragraphsArr.push({
                        content: paragraphText,
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
                console.log('analyzedResult-->', analyzedResult);
                yield NewsModel_1.NewsModel.create(analyzedResult);
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
}
exports.CNNCrawler = CNNCrawler;
