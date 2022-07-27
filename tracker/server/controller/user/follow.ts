import { TechBaseRouter } from '../../infra/interfaces/express'
import FollowDb from '../../db/modules/user/follow'
import logger from '../../utils/logger'

const tag = '/controller/user/follow/'

class Follow {
	follow: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'follow'
		try {
			const result = await FollowDb.follow(req.body)

			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: req.body,
				msg: 'Fail to add follow',
				error,
			})
		}
	}

	getFollow: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'getFollow'
		const id = req.me.id
		const page = Number(req.query.page) - 1

		try {
			const result = await FollowDb.getFollow(id, page)

			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: req.query,
				msg: 'Fail to get follow',
				error,
			})
		}
	}
	deleteFollow: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'deleteFollow'
		try {
			const { noticeID } = req.body
			const result = await FollowDb.deleteFollow(req.me.id, noticeID)
			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: req.body,
				msg: 'Fail to delete Follow',
				error,
			})
		}
	}
}
export = new Follow()
