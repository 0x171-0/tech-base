import watchLaterDb from '../../db/modules/user/watchLater'
import { TechBaseRouter } from '../../infra/interfaces/express'
import logger from '../../utils/logger'

const tag = '/controller/user/watchLater'
class watchLater {
	addWatchLater: TechBaseRouter = async (req, res, next) => {
		const _tag = 'addWatchLater'
		try {
			const watchLater = req.body
			const watchLaterRes = await watchLaterDb.addWatchLater(watchLater)
			res.status(200).send({
				result: 'success',
				data: watchLaterRes,
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}

	getWatchLater: TechBaseRouter = async (req, res, next) => {
		const _tag = 'getWatchLater'
		const id = req.me.id
		const page = Number(req.query.page) - 1
		try {
			const result = await watchLaterDb.getWatchLater(id, page)

			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}

	deleteWatchLater: TechBaseRouter = async (req, res, next) => {
		const _tag = 'deleteWatchLater'
		try {
			const result = watchLaterDb.deleteWatchLater(
				req.me.id,
				req.body.watchLaterId,
			)
			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}
}

export = new watchLater()
