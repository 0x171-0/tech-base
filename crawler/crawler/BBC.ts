import cheerio from 'cheerio'
import config from 'config'
import moment from 'moment'
import axios from 'axios'
import logger from '../utils/logger'
import { Crawler, AnalyzedResult } from './crawlerBase'
import { DB } from '../db/index'
import { NLP } from '../nlp/nlp'
import { NewsModel } from '../db/models/NewsModel'

export class BBCCrawler extends Crawler {
	constructor(nlp: NLP, db: DB) {
		super(nlp, db)
		this.publisher = 'BBC'
		this.tag = '/crawler/BBC'
		this.dailyNewsList = []
	}

	async crawlNewsList() {
		try {
			const { data } = await axios.get(config.get('crawler.bbc.newsListUrl'))
			const $ = cheerio.load(data)
			const headLineStories = $(
				'a.gs-c-promo-heading.gs-o-faux-block-link__overlay-link' +
					'.gel-pica-bold.nw-o-link-split__anchor',
			)
			const headLineStoriesArr: string[] = []

			headLineStories.each((index: number, value: any) => {
				const hrefArrH = $(value).attr('href')
				if (!hrefArrH || hrefArrH.split('/')[2].split('-')[0] !== 'technology')
					return
				headLineStoriesArr.push(hrefArrH)
			})
			this.dailyNewsList = [...new Set(headLineStoriesArr)]
			console.log('this.dailyNewsList ->', this.dailyNewsList)

			await this.nlp.init()
		} catch (error) {
			logger.error({
				tag: this.tag,
				msg: 'Fail to crawl the news list',
				error,
			})
			return
		}
	}

	async crawlNews(url: string): Promise<void | AnalyzedResult> {
		let analyzedResult: AnalyzedResult = {}
		const href = config.get('crawler.bbc.baseNewsUrl') + url
		try {
			if (await this.isNewsExist(href)) return

			const $ = await this._fetchHTMLOfNews(href)
			const newsDate = $('header').find('time').attr('datetime')

			const title = $('h1').text().trim()
			const newsOriginParagraphs = $('.e1sbfw0p0  p')

			if (!newsDate || !newsOriginParagraphs || !title) {
				console.log('The Content is Not News.')
				return
			}
			const paragraphsArr: { content: string }[] = []
			let contentString: string = title.toLowerCase()

			await newsOriginParagraphs.each((index: number, value: any) => {
				const text = $(value).text()
				if (text.charAt(0) === '<') {
					return
				}
				contentString = contentString + text
				paragraphsArr.push({
					content: text,
				})
			})

			const {
				score,
				comparative,
				positive,
				negative,
				calculation,
			} = await this.nlp.analyzeSentiment(contentString)

			const { terms, behaviors, tags } = await this.nlp.analyzeContent(
				contentString,
			)

			analyzedResult = {
				publisher: this.publisher,
				date: moment(new Date(newsDate), 'MMM Do YY'),
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
			}

			await NewsModel.create(analyzedResult)
			console.log('analyzedResult->', analyzedResult)

			return analyzedResult
		} catch (error) {
			logger.error({
				tag: this.tag,
				msg: 'Fail to crawl the news',
				error,
				href: analyzedResult.href,
			})
			throw error
		}
	}

	async validateNewsContent($: any) {}

	async _fetchHTMLOfNews(href: string) {
		const { data } = await axios.get(href)
		return cheerio.load(data)
	}
}
