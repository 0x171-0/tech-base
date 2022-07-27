"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const news_1 = __importDefault(require("../controller/news"));
const authorization_1 = require("../middleWares/authorization");
router
    .route('/news/allTopTags')
    .get(news_1.default.cacheAllTopTags, news_1.default.getAllTopTags);
router
    .route('/news/timeline')
    .get(news_1.default.cacheNews, news_1.default.getNewsTimeline);
router
    .route('/news/analyze/lineChart/:timeSpan')
    .get(news_1.default.getAnalyzeLineChart);
router
    .route('/news/detail')
    .get(news_1.default.cacheNews, news_1.default.getNewsDetail);
router
    .route('/news/search')
    .get(news_1.default.cacheNews, news_1.default.searchNews);
router.route('/news/comment/:search').get(news_1.default.getComments);
router.route('/news/comment/:search').post(authorization_1.isAuth, news_1.default.postComment);
module.exports = router;
