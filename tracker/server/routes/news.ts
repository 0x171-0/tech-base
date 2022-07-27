const router = require('express').Router()
import NewsController from '../controller/news'
import { isAuth } from '../middleWares/authorization'

router
	.route('/news/allTopTags')
	.get(NewsController.cacheAllTopTags, NewsController.getAllTopTags)

router
	.route('/news/timeline')
	.get(NewsController.cacheNews, NewsController.getNewsTimeline)

router
	.route('/news/analyze/lineChart/:timeSpan')
	.get(NewsController.getAnalyzeLineChart)

router
	.route('/news/detail')
	.get(NewsController.cacheNews, NewsController.getNewsDetail)

router
	.route('/news/search')
	.get(NewsController.cacheNews, NewsController.searchNews)

router.route('/news/comment/:search').get(NewsController.getComments)

router.route('/news/comment/:search').post(isAuth, NewsController.postComment)

module.exports = router
