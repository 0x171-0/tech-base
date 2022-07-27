import mongoose from 'mongoose'
import config from 'config'
import * as asyncRedis from 'async-redis'
import logger from '../utils/logger'

const tag = '/db/init'

export const initTechBaseDb = async () => {
	try {
		await mongoose.connect(config.get('db.url'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})

		const techBaseDbConn = mongoose.connection
		await techBaseDbConn.once('open', () =>
			logger.info('--- Connected to Database --')
		)
		techBaseDbConn.on('error', (error: Error) => console.error(error))
	} catch (err) {
		console.error(err.message)
		process.exit(1)
	}
}

export const disconnectDb = async () => {
	return await mongoose.disconnect()
}

export const redisClient = asyncRedis.createClient({
	host: String(config.get('redis.host')),
	port: Number(config.get('redis.port')),
	retry_strategy: function (options) {
		if (options.error && options.error.code === 'ECONNREFUSED') {
			return new Error('The server refused the connection')
		}
		if (options.total_retry_time > 1000 * 30) {
			return new Error('Retry time exhausted')
		}
		if (options.attempt > 10) {
			return undefined
		}
		return Math.min(options.attempt * 100, 3000)
	},
})

export const disconnectRedis = async () => {
	redisClient.quit()
}

redisClient.on('error', (error: Error) => {
	logger.error({
		tag,
		error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
	})
})

redisClient.on('ready', () => {
	logger.info({ tag, msg: `Redis ready on: ${process.env.NODE_ENV}` })
})

redisClient.on('connect', () => {
	logger.info({ tag, msg: `Redis connected on: ${process.env.NODE_ENV}` })
})
