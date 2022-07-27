import config from 'config'
import { initTechBaseDb, disconnectDb, disconnectRedis } from './db/init'
import { crawlAndSaveAllSource } from './crawler/index'
import { CronJob } from 'cron'
import logger from './utils/logger'
const env = process.env.NODE_ENV || 'development'
const express = require('express')
const app = express()
import { handleError } from './utils/middlewares/errorHandler'
import { Server } from 'http'
import { NLP } from './nlp/nlp'
const nlp = new NLP()

const server = app.listen(config.get('port'), async () => {
	try {
		console.log(`--- [ ENV : ${env}]  ---`)
		console.log(`--- Crawl server running on port ${config.get('port')} ---`)
		await initTechBaseDb()

		await crawlAndSaveAllSource()
		return
		// const job = new CronJob(
		// 	'0 9,18,23 * * *',
		// 	crawlAndSaveAllSource,
		// 	null,
		// 	true,
		// 	'Asia/Taipei'
		// )

		// job.start()
	} catch (error) {
		console.log(error)
	}
})

app.use(handleError)

function terminate(
	server: Server,
	options = { coredump: false, timeout: 500 },
) {
	return (code: number, reason: string) => async (
		err: Error,
		promise: Error,
	) => {
		const _exit = () => {
			options.coredump ? process.abort() : process.exit(code)
		}
		if (err && err instanceof Error) {
			logger.error({ tag: 'server', error: err })
		}

		server.close(_exit)
		await disconnectDb()
		disconnectRedis()
		setTimeout(_exit, options.timeout).unref()
	}
}

const exitHandler = terminate(server, {
	coredump: false,
	timeout: 500,
})

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))
process.setMaxListeners(0)

module.exports = {
	app,
	server,
}
