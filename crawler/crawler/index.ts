import logger from '../utils/logger'
import { redisClient } from '../db/init'
import { NLP } from '../nlp/nlp'
import { DB } from '../db/index'
import { BBCCrawler } from '../crawler/BBC'
import { CNNCrawler } from '../crawler/CNN'
import { REUTERSCrawler } from './REUTERS'

const nlp = new NLP()
const db = new DB()
const bbc = new BBCCrawler(nlp, db)
const cnn = new CNNCrawler(nlp, db)
const routers = new REUTERSCrawler(nlp, db)

export async function crawlAndSaveAllSource() {
	try {
		console.log('Start Crawl the news!')
		await bbc.crawlAndSave()
		await cnn.crawlAndSave()
		await routers.crawlAndSave()
		// await redisClient.flushall()
	} catch (error) {
		logger.error({
			tag: '/crawlAndSaveAllSource',
			error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
		})
	}
}
