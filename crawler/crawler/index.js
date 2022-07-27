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
exports.crawlAndSaveAllSource = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const init_1 = require("../db/init");
const nlp_1 = require("../nlp/nlp");
const index_1 = require("../db/index");
const BBC_1 = require("../crawler/BBC");
const CNN_1 = require("../crawler/CNN");
const REUTERS_1 = require("./REUTERS");
const nlp = new nlp_1.NLP();
const db = new index_1.DB();
const bbc = new BBC_1.BBCCrawler(nlp, db);
const cnn = new CNN_1.CNNCrawler(nlp, db);
const routers = new REUTERS_1.REUTERSCrawler(nlp, db);
function crawlAndSaveAllSource() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Start Crawl the news!');
            yield bbc.crawlAndSave();
            yield cnn.crawlAndSave();
            yield routers.crawlAndSave();
            yield init_1.redisClient.flushall();
        }
        catch (error) {
            logger_1.default.error({
                tag: '/crawlAndSaveAllSource',
                error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
            });
        }
    });
}
exports.crawlAndSaveAllSource = crawlAndSaveAllSource;
