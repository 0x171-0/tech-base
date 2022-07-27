import BookmarkDb from '../../db/modules/user/bookmarks'
import { TechBaseRouter } from '../../infra/interfaces/express'
import logger from '../../utils/logger'
const tag = '/controller/user/bookmarks/'

class Bookmark {
	addBookmark: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'addBookmark'
		const bookmarkInfo = req.body
		try {
			const bookmarkRes = await BookmarkDb.addBookmark(bookmarkInfo)
			res.status(200).send({
				result: 'success',
				data: bookmarkRes,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: bookmarkInfo,
				msg: 'Fail to add bookmark',
				error,
			})
		}
	}

	getBookmarks: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'getBookmarks'
		const userId = req.me.id
		const page = Number(req.query.page) - 1
		const folder = req.query.folder as string

		try {
			const result = await BookmarkDb.getBookmarks(String(userId), page, folder)

			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: { id: String(userId), page, folder },
				msg: 'Fail to get bookmarks',
				error,
			})
		}
	}

	deleteBookmark: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'deleteBookmark'
		const userId = req.me.id
		const bookmarkId = req.body.bookmarkId.split('_')[1]
		try {
			const result = BookmarkDb.deleteBookmark(userId, bookmarkId)

			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				msg: 'Fail to delete bookmark',
				error,
			})
		}
	}

	deleteBookFold: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'deleteBookFold'
		try {
			const userId = req.me.id
			const result = await BookmarkDb.deleteBookFold({ userId, ...req.body })

			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				msg: 'Fail to delete bookmark folder',
				error,
			})
		}
	}
}

export = new Bookmark()
