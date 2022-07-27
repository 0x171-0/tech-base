import logger from '../../utils/logger'
import { error } from 'winston'
import HistoryDb from '../../db/modules/user/history'
import { TechBaseRouter } from '../../infra/interfaces/express'

const tag = 'controller/user/history'
class History {
	addHistory: TechBaseRouter = async (req, res, next) => {
		const _tag = '/addHistory'
		try {
			await HistoryDb.addHistory({
				userId: req.me.id,
				userEmail: req.me.email,
				userName: req.me.name,
				...history,
			})
			res.status(200).send({
				result: 'success',
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				error,
			})
			next(error)
		}
	}

	getHistory: TechBaseRouter = async (req, res, next) => {
		const _tag = '/getHistory'
		try {
			const userId = req.me.id
			const page = Number(req.query.page) - 1
			const result = await HistoryDb.getHistory(String(userId), page)
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

	deleteHistory: TechBaseRouter = async (req, res, next) => {
		const _tag = '/deleteHistory'
		try {
			const result = HistoryDb.deleteHistory(
				req.me.id,
				req.body.historyId.split('_')[1],
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

export = new History()
