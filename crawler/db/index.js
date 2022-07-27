"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const news_1 = require("./Modules/news");
class DB {
    constructor() {
        this.NewsModel = new news_1.NewsModule();
    }
}
exports.DB = DB;
