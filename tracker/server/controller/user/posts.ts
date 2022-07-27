import { TechBaseRouter } from '../../infra/interfaces/express'
import PostsDb from '../../db/modules/user/posts'
import logger from '../../utils/logger'
const tag = '/controller/user/posts/'

class Posts {
	addPost: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'addPost'
		const postInfo = req.body
		try {
			const postRes = await PostsDb.addPost(postInfo)
			res.status(200).send({
				result: 'success',
				data: postRes,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: postInfo,
				error,
			})
		}
	}

	getPosts: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'getPosts'
		const userId = req.me.id
		const page = Number(req.query.page) - 1
		const folder = req.query.folder as string
		try {
			const result = await PostsDb.getPosts(userId, page, folder)
			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: { id: userId, page, folder },
				error,
			})
		}
	}

	deletePost: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'deletePost'
		const userId = req.body.userId
		const postId = req.body.postId.split('_')[1]
		try {
			const result = await PostsDb.deletePost(userId, postId)
			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: { userId, postId },
				error,
			})
		}
	}

	deletePostFold: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'deletePostFold'
		try {
			const result = await PostsDb.deletePostFold(req.body)
			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: req.body,
				error,
			})
		}
	}
}

export = new Posts()
