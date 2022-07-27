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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crawler = void 0;
const init_1 = require("../db/init");
class Crawler {
    constructor(nlp, db) {
        this.dailyNewsList = [];
        this.publisher = '';
        this.tag = '';
        this.intervalSecondsBetweenCrawl = 15000;
        this._sleep = (time) => {
            return new Promise((resolve) => setTimeout(resolve, time));
        };
        this.nlp = nlp;
        this.db = db;
    }
    crawlNewsList() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    crawlNews(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    isNewsExist(href) {
        return __awaiter(this, void 0, void 0, function* () {
            let newsId = yield init_1.redisClient.get(`news_url_${href}`);
            if (!newsId) {
                const newsInDb = yield this.db.NewsModel.searchByHref(href);
                if (newsInDb) {
                    yield init_1.redisClient.set(`news_url_${href}`, newsInDb.id);
                    return true;
                }
                return false;
            }
            return true;
        });
    }
    crawlAndSave() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.crawlNewsList();
            if (!(this.dailyNewsList instanceof Array))
                return;
            for (let i = 1; i < this.dailyNewsList.length; i++) {
                yield this.crawlNews(this.dailyNewsList[i]);
                yield this._sleep(this.intervalSecondsBetweenCrawl);
            }
        });
    }
}
exports.Crawler = Crawler;
