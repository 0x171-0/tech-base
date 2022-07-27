import { NewsModel, NewsInterface } from '../models/NewsModel'
import config from 'config'
import { ErrorType } from '../../infra/enums/errorType'
import { redisClient } from '../../db/init'
import Time from '../../utils/formatTime'
import moment from 'moment'
import { ErrorHandler } from '../../middleWares/errorHandler'
import { safeAwait } from '../../utils/safeAwait'

const tag = 'server/db/modules/news'
class NewsDb {
	async gatNewsList(opt: {
		startTime?: string | Date
		endTime?: string | Date
		page?: number
		tag?: string
		keywords?: string
	}) {
		try {
			const { keywords, startTime, endTime, page = 0, tag } = opt

			const findCondition: any = {
				date: {
					$gte: startTime,
				},
			}
			if (endTime) findCondition.date.$lte = endTime
			if (tag) findCondition['tags.tags'] = tag
			if (keywords) {
				findCondition.$text = {}
				findCondition.$text.$search = keywords
			}

			const news = await NewsModel.find(findCondition)
				.sort({
					date: -1,
				})
				.limit(7)
				.skip(6 * page)

			let nextPage = null
			if (news[6]) nextPage = page + 2
			if (news.length == 7) news.pop()

			const searchNews = {
				news: news,
				nextPage: nextPage,
			}

			const [_error, data] = await safeAwait(
				redisClient.setex(
					`searchByTag_${tag}_${startTime}_${endTime}_${page}`,
					config.get('redis.expireTime'),
					JSON.stringify(searchNews),
				),
				tag + '/gatNewsList/redis',
			)

			return searchNews
		} catch (error) {
			throw error
		}
	}

	async searchNewsDetail(opt: { title?: string; href?: string }) {
		try {
			const { title, href } = opt
			const findCondition: any = {}
			if (title) findCondition.title = title
			if (href) findCondition.title = href
			return (await NewsModel.find(findCondition))[0]
		} catch (error) {
			throw error
		}
	}

	oneTopTags = async (tag: string) => {
		try {
			await NewsModel.aggregate([
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
				return toptags[0].tags
			})
		} catch (error) {
			throw error
		}
	}

	sumTagDay = async (tag: string) => {
		try {
			const tagDayNum = await NewsModel.aggregate([
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
			]).limit(7) // limit days

			return tagDayNum
		} catch (error) {
			throw error
		}
	}

	sumTagsDay = async (tags: string[], newsDate: Date) => {
		try {
			const last7Date = new Date(newsDate.getTime() - 7 * 24 * 60 * 60 * 1000)
			const tagDayNum = await NewsModel.aggregate([
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
			])
			return tagDayNum
		} catch (error) {
			throw error
		}
	}

	sumTagWeek = async (tag: string) => {
		try {
			const tagDayNum = await NewsModel.aggregate([
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
			]).limit(8) // limit days
			return tagDayNum
		} catch (error) {
			throw error
		}
	}

	sumTagsWeek = async (tags: string[], endDate: Date) => {
		try {
			const last8Week = new Date(endDate.getTime() - 49 * 24 * 60 * 60 * 1000)
			const tagDayNum = await NewsModel.aggregate([
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
			]).limit(8)
			return tagDayNum
		} catch (error) {
			throw error
		}
	}

	sumTagMonth = async (tag: string) => {
		try {
			const tagDayNum = await NewsModel.aggregate([
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
			]).limit(13)
			return tagDayNum
		} catch (error) {
			throw error
		}
	}

	sumTagsMonth = async (tags: string[], endDate: Date) => {
		try {
			const last12Month = new Date(
				endDate.getTime() - 360 * 24 * 60 * 60 * 1000,
			)

			const tagDayNum = await NewsModel.aggregate([
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
			])
			return tagDayNum
		} catch (error) {
			throw error
		}
	}

	allTopTags = async () => {
		try {
			const nowDate = new Date()
			const newsTagsArr: NewsInterface[] = await NewsModel.find({
				date: {
					$gte: new Date(nowDate.getTime() - 21 * 24 * 60 * 60 * 1000),
				},
			}).select('tags -_id')
			let mergeRes = await this.mergeAllTags(newsTagsArr)
			if (!mergeRes) {
				const newsTagsArr: NewsInterface[] = await NewsModel.find()
					.select('tags -_id')
					.sort({
						date: -1,
					})
					.limit(30)
				mergeRes = await this.mergeAllTags(newsTagsArr)
			}
			const sortAll = mergeRes.sort(function (
				tagA: [string, unknown],
				tagB: [string, unknown],
			): number {
				if (Number(tagA[1]) > Number(tagB[1])) return -1
				if (Number(tagB[1]) > Number(tagA[1])) return 1
				return 0
			})

			const chartData = await sortAll
				.map((e) => {
					return {
						x: e[0],
						value: e[1],
					}
				})
				.slice(0, 99)

			if (chartData) {
				const [_error, data] = await safeAwait(
					redisClient.setex(
						'allTopTags',
						config.get('redis.expireTime'),
						JSON.stringify(chartData),
					),
					tag + '/allTopTags/redis',
				)
			}

			return chartData
		} catch (error) {
			throw error
		}
	}

	mergeAllTags = async (newsTagsArr: NewsInterface[]) => {
		try {
			const merge: any = {}
			newsTagsArr.forEach((basket) => {
				basket.tags.forEach((tagInfo: { tags: string; count: number }) => {
					if (merge[tagInfo.tags]) {
						merge[tagInfo.tags] += Number(tagInfo.count)
					} else {
						merge[tagInfo.tags] = Number(tagInfo.count)
					}
				})
			})
			const tags = Object.entries(merge)
			return tags
		} catch (error) {
			throw error
		}
	}
}

export = new NewsDb()
