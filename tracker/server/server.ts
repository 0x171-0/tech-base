import config from 'config'
import logger from './utils/logger'
import path from 'path'
// import bodyParser from 'body-parser'
import { handleError } from './middleWares/errorHandler'
import { Server } from 'http'
import { initTechBaseDb, disconnectDb, disconnectRedis } from './db/init'
import morgan from 'morgan'
import { Next } from './infra/interfaces/express'
import ErrorController from './controller/error'
const { socketIoInit } = require('./webSocket/index')

const env = process.env.NODE_ENV || 'development'
const express = require('express')
const app = express()

const initServer = async () => {
	try {
		const server = app.listen(config.get('port'))
		console.log(`--- [ ENV : ${env}]  ---`)
		console.log(`--- Tracker server running on port ${config.get('port')} ---`)
		await socketIoInit(server)
		await initTechBaseDb()

		const _exitHandler = terminate(server, {
			coredump: false,
			timeout: 500,
		})

		// app.use(
		// 	bodyParser.urlencoded({
		// 		extended: true,
		// 	}),
		// )
		// app.use(bodyParser.json())

		app.set('views', '../client')
		app.use(express.json())
		app.use(express.urlencoded())
		app.use(express.static(path.join(__dirname, '../client')))

		app.use((req: Request, res: any, next: Next) => {
			var originalSend = res.send
			res.send = function (body: any) {
				res.__body_response = body
				originalSend.call(this, body)
			}
			next()
		})

		morgan.token('accessLog', (tokens: any, req: any, res: any) => {
			return [
				tokens.method(req, res),
				tokens.url(req, res),
				tokens.status(req, res),
				'-',
				tokens['response-time'](req, res),
				'ms',
				'\nrequest: ' + JSON.stringify(req.body),
				// '\nresponse: ' + res.__body_response,
			].join(' ')
		})
		// @ts-ignore
		app.use(morgan('accessLog', { stream: logger.stream }))

		// API routes
		app.use('/api/' + config.get('api.version'), [
			require('./routes/user/follow'),
			require('./routes/user/bookmarks'),
			require('./routes/user/history'),
			require('./routes/user/images'),
			require('./routes/user/posts'),
			require('./routes/user/users'),
			require('./routes/user/watchLater'),
			require('./routes/news'),
		])

		app.use(ErrorController.get404)
		app.use(handleError)
		process.on('uncaughtException', _exitHandler(1, 'Unexpected Error'))
		process.on('unhandledRejection', _exitHandler(1, 'Unhandled Promise'))
		process.on('SIGTERM', _exitHandler(0, 'SIGTERM'))
		process.on('SIGINT', _exitHandler(0, 'SIGINT'))
	} catch (error) {
		console.log(error)
	}
}

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

initServer()

module.exports = {
	app,
}
