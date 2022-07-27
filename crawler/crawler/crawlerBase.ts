import { DB } from '../db/index'
import { NLP } from '../nlp/nlp'
import { Moment } from 'moment'
import { redisClient } from '../db/init'

export class Crawler {
	nlp: NLP
	db: DB
	dailyNewsList: string[] = []
	publisher: string = ''
	tag: string = ''
	intervalSecondsBetweenCrawl: number = 15000

	constructor(nlp: NLP, db: DB) {
		this.nlp = nlp
		this.db = db
	}

	_sleep = (time: number) => {
		return new Promise((resolve) => setTimeout(resolve, time))
	}

	async crawlNewsList(): Promise<void> {
		return
	}
	async crawlNews(url: string): Promise<void | AnalyzedResult> {
		return
	}
	async isNewsExist(href: string) {
		let newsId = await redisClient.get(`news_url_${href}`)
		if (!newsId) {
			const newsInDb = await this.db.NewsModel.searchByHref(href)
			if (newsInDb) {
				await redisClient.set(`news_url_${href}`, newsInDb.id)
				return true
			}
			return false
		}
		return true
	}

	async crawlAndSave() {
		await this.crawlNewsList()
		if (!(this.dailyNewsList instanceof Array)) return
		for (let i = 1; i < this.dailyNewsList.length; i++) {
			await this.crawlNews(this.dailyNewsList[i])
			await this._sleep(this.intervalSecondsBetweenCrawl)
		}
	}
}

export interface AnalyzedResult {
	publisher?: string
	date?: Moment
	title?: string
	href?: string
	tags?: object
	content?: { content: string }[]
	score?: number
	comparative?: number
	positive?: object
	negative?: object
	terms?: object
	behaviors?: object
	portion?: number
	calculation?: number[]
}
