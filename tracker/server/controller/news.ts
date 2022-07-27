import { TechBaseRouter } from '../infra/interfaces/express'
import { redisClient } from '../db/init'
import CommentsDb from '../db/modules/user/comments'
import NewsDb from '../db/modules/news'
import NewsService from '../service/news'
import moment from 'moment'
import { ErrorHandler } from '../middleWares/errorHandler'
import { ErrorType } from '../infra/enums/errorType'
import logger from '../utils/logger'
import { safeAwait } from '../utils/safeAwait'

// Reference: [Mongo DB allow time format] https://www.tutorialkart.com/mongodb/mongodb-date/

const tag = '/controller/news/'
class NewsController {
	getAllTopTags: TechBaseRouter = async (req, res, next) => {
		const _tag = '/getAllTopTags'
		try {
			res.status(200).send({
				result: 'success',
				data: await NewsDb.allTopTags(),
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}

	getAnalyzeLineChart: TechBaseRouter = async (req, res, next) => {
		const _tag = '/getAnalyzeLineChart'
		try {
			const timeSpan = req.params.timeSpan
			const lineTags = (req.query.tags as string).split(',')
			const newsDate = req.query.date as string
			res.status(200).send({
				result: 'success',
				data: await NewsService.getTagsByTime({
					timeSpan,
					topTags: lineTags,
					newsDate,
				}),
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}

	getNewsTimeline: TechBaseRouter = async (req, res, next) => {
		const _tag = '/getNewsTimeline'
		try {
			const startTime = (req.query.startTime as string) || '2007-07-07'
			const endTime =
				(req.query.endTime as string) ||
				moment().endOf('day').format('YYYY-MM-DD')
			moment().endOf('day').format('YYYY-MM-DD')
			const sort = req.query.sort as string
			const page = Number(req.query.page) - 1

			res.status(200).send({
				result: 'success',
				data: await NewsDb.gatNewsList({
					tag: sort,
					page,
					startTime,
					endTime,
				}),
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}

	getNewsDetail: TechBaseRouter = async (req, res, next) => {
		const _tag = '/getNewsDetail'
		try {
			const title = decodeURIComponent(req.query.title as string)
			res.status(200).send({
				result: 'success',
				data: await NewsDb.searchNewsDetail({ title }),
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}

	searchNews: TechBaseRouter = async (req, res, next) => {
		const _tag = '/searchNews'
		try {
			const keywords = req.query.search as string
			const startTime = (req.query.startTime as string) || '2007-07-07'
			const endTime =
				(req.query.endTime as string) ||
				moment().endOf('day').format('YYYY-MM-DD')
			const page = Number(req.query.page) - 1
			res.status(200).send({
				result: 'success',
				data: await NewsDb.gatNewsList({
					keywords,
					page,
					startTime,
					endTime,
				}),
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				msg: error.message,
				error,
			})
			next(error)
		}
	}

	getComments: TechBaseRouter = async (req, res, next) => {
		const _tag = '/getComments'
		const search = req.params.search

		try {
			switch (search) {
				case 'comment':
					const comment = req.query.content as string
					const data = await CommentsDb.findComment(comment)
					res.status(200).send({
						result: 'success',
						data,
					})
					break

				case 'toggleEmoji':
					res.status(200).send({
						result: 'success',
						data: await CommentsDb.toggleEmoji(req.body),
					})
					break

				case 'getSumEmoji':
					const { userId, contentId } = req.query
					res.status(200).send({
						result: 'success',
						data: await CommentsDb.getSumEmoji({
							userId: userId as string,
							contentId: contentId as string,
						}),
					})
					break

				default:
					res.redirect('./public/timeline.html')
			}
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				msg: error.message,
				error,
			})
			next(error)
		}
	}

	postComment: TechBaseRouter = async (req, res, next) => {
		const _tag = '/postComment'
		const search = req.params.search
		try {
			switch (search) {
				case 'toggleEmoji':
					res.status(200).send({
						result: 'success',
						data: await CommentsDb.toggleEmoji(req.body),
					})
					break

				default:
					res.redirect('./public/timeline.html')
			}
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}

	cacheAllTopTags: TechBaseRouter = async (req, res, next) => {
		const _tag = '/cacheAllTopTags'
		try {
			const [_error, data] = await safeAwait(
				redisClient.get(`allTopTags`),
				tag + '/cacheAllTopTags/redis',
			)

			data
				? res
						.status(200)
						.send({ result: 'success', data: JSON.parse(String(data)) })
				: next()
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}

	cacheNews: TechBaseRouter = async (req, res, next) => {
		const _tag = '/cacheNews'
		try {
			const startTime = (req.query.startTime as string) || '2007-07-07'
			const endTime =
				(req.query.endTime as string) || new Date().setHours(23, 59, 59, 999)
			const sort = req.query.sort
			const page = Number(req.query.page) - 1

			if (sort == 'time') {
				const [_error, data] = await safeAwait(
					redisClient.get(`searchByTime_${startTime}_${endTime}_${page}`),
					tag + '/cacheNews/redis',
				)

				data
					? res
							.status(200)
							.send({ result: 'success', data: JSON.parse(String(data)) })
					: next()
			} else {
				const [_error, data] = await safeAwait(
					redisClient.get(
						`searchByTag_${sort}_${startTime}_${endTime}_${page}`,
					),
					tag + '/cacheNews/redis',
				)

				data
					? res
							.status(200)
							.send({ result: 'success', data: JSON.parse(String(data)) })
					: next()
			}
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}
}

export = new NewsController()
