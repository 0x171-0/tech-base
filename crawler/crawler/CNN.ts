import config from 'config'
import moment from 'moment'
import puppeteer from 'puppeteer'
import logger from '../utils/logger'
import { Crawler, AnalyzedResult } from './crawlerBase'
import { DB } from '../db/index'
import { NLP } from '../nlp/nlp'
import { NewsModel } from '../db/models/NewsModel'

export class CNNCrawler extends Crawler {
	constructor(nlp: NLP, db: DB) {
		super(nlp, db)
		this.publisher = 'CNN'
		this.tag = '/crawler/CNN'
		this.dailyNewsList = []
	}

	async crawlNewsList() {
		try {
			const browser = await puppeteer.launch({ headless: true })
			const page = await browser.newPage()
			await page.setDefaultNavigationTimeout(0)
			await page.goto(config.get('crawler.cnn.newsListUrl'), {
				waitUntil: ['networkidle2'],
			})
			const hrefArr: string[] = await page.$$eval(
				'a[href*=tech][href*="index.html"]',
				(options: any[]) =>
					options.map((option) => {
						return option.href.split('https://edition.cnn.com')[1]
					}),
			)
			await browser.close()
			this.dailyNewsList = [...new Set(hrefArr)]
			console.log('	this.dailyNewsList->', this.dailyNewsList)
			await this.nlp.init()
		} catch (error) {
			logger.error({
				tag: this.tag,
				msg: 'Fail to crawl the news list',
				error,
			})
			throw error
		}
	}

	async crawlNews(url: string): Promise<void | AnalyzedResult> {
		let analyzedResult: AnalyzedResult = {}
		const href = config.get('crawler.cnn.baseNewsUrl') + url
		try {
			if (await this.isNewsExist(href)) return

			const browser = await puppeteer.launch({ headless: true })
			const page = await browser.newPage()
			await page.setDefaultNavigationTimeout(0)

			await page.goto(href, { waitUntil: ['networkidle2'] })

			const title = await page.$eval('.pg-headline', (el: any) => el.innerText)
			const newsDate = (
				await page.$eval('.update-time', (el: any) => el.innerText)
			).split(`) `)[1]

			const newsOriginParagraphs: string[] = await page.$$eval(
				'.zn-body__paragraph',
				(nodes: any) => nodes.map((n: any) => n.innerText),
			)

			await browser.close()

			if (!newsDate || !title || !newsOriginParagraphs) {
				console.log('The Content is Not News.')
				return
			}

			const paragraphsArr: { content: string }[] = []
			let contentString: string = title.toLowerCase()

			await newsOriginParagraphs.forEach((paragraphText: string) => {
				if (!paragraphText.length) return
				contentString += paragraphText
				paragraphsArr.push({
					content: paragraphText,
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
			console.log('analyzedResult-->', analyzedResult)
			await NewsModel.create(analyzedResult)
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
}
