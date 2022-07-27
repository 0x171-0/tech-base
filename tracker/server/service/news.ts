import { TechBaseRouter } from '../infra/interfaces/express'
import { redisClient } from '../db/init'
import CommentsDb from '../db/modules/user/comments'
import NewsDb from '../db/modules/news'
import async from 'async'
import { ErrorHandler } from '../middleWares/errorHandler'
import { ErrorType } from '../infra/enums/errorType'
import logger from '../utils/logger'
import moment from 'moment'
import Time from '../utils/formatTime'

const tag = '/service/news/'

class NewsService {
	getTagsByTime = async (opt: {
		timeSpan: string
		topTags: string[]
		newsDate: string
	}) => {
		try {
			const { timeSpan, topTags, newsDate } = opt
			let timeSpanArr
			let timeSpanData

			const endDate = new Date(newsDate)
			switch (timeSpan) {
				case 'day':
					timeSpanArr = await Time.forMatDay(7, endDate)
					timeSpanData = await NewsDb.sumTagsDay(topTags, endDate)
					return await this.formatTagsTimeSpan(
						'day',
						topTags,
						timeSpanArr,
						timeSpanData,
					)
				case 'week':
					timeSpanArr = await Time.forMatWeek(7, endDate)
					timeSpanData = await NewsDb.sumTagsWeek(topTags, endDate)

					return await this.formatTagsTimeSpan(
						'week',
						topTags,
						timeSpanArr,
						timeSpanData,
					)
				case 'month':
					timeSpanArr = await Time.forMatMonth(7, endDate)
					timeSpanData = await NewsDb.sumTagsMonth(topTags, endDate)
					return await this.formatTagsTimeSpan(
						'month',
						topTags,
						timeSpanArr,
						timeSpanData,
					)
			}
		} catch (error) {
			throw error
		}
	}

	formatTagsTimeSpan = async (
		timeType: string,
		topTags: string[],
		timeSpanArr: (string | number)[][],
		timeSpanData: {
			_id: { day: string; year: string; week: string; month: string }
			tags: string
			count: number
		}[],
	) => {
		try {
			if (timeSpanData.length === 0) {
				throw new ErrorHandler(403, ErrorType.DatabaseError, 'Search no news')
			}
			let isSameTime: string
			topTags.forEach((tag, tagIndex) => {
				timeSpanData.forEach(
					(news: {
						_id: {
							day: string
							year: string
							week: string
							month: string
							tag?: string
						}
						tags: string
						count: number
					}) => {
						if (news._id.tag == tag) {
							timeSpanArr.forEach(
								(time: (string | number)[], timeIndex: number) => {
									switch (timeType) {
										case 'day':
											isSameTime = moment(news._id.day)
												.format('YYYY-MM-DD')
												.slice(0, 10)
											break
										case 'week':
											isSameTime = news._id.year + ' w' + news._id.week
											break
										case 'month':
											isSameTime = news._id.year + '/' + news._id.month
											break
									}
									if (time[0] == isSameTime) {
										timeSpanArr[timeIndex][tagIndex + 1] = news.count
									} else {
										timeSpanArr[timeIndex][tagIndex + 1] = timeSpanArr[
											timeIndex
										][tagIndex + 1]
											? timeSpanArr[timeIndex][tagIndex + 1]
											: 0
									}
								},
							)
						}
					},
				)
			})
			return timeSpanArr
		} catch (error) {
			throw error
		}
	}
}

export = new NewsService()
