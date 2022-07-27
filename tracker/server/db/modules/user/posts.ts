import { ObjectId } from 'mongodb'
import { UserModel, UserInterface } from '../../models/UserModel'
import { customErrors } from '../../../infra/customErrors'

class PostsDb {
	addPost = async (info: {
		_id: string
		publisher: string
		date: Date
		title: string
		href: string
		img: string
		content: string
		tags: string
		commentDate: Date
		commentTitle: string
		comment: string
		userId: string
		folderNew?: string
		folder?: string
	}) => {
		try {
			const user: UserInterface | null = await UserModel.findOne({
				_id: new ObjectId(info.userId),
			})
			if (!user) throw new Error(customErrors.USER_NOT_FOUND.type)

			const post = {
				news_id: info._id,
				publisher: info.publisher,
				date: info.date,
				title: info.title,
				href: info.href,
				img: info.img,
				content: info.content,
				tags: info.tags,
				comment_date: info.commentDate,
				comment_title: info.commentTitle,
				comment: info.comment,
				folder: '',
			}
			if (info.folderNew) {
				post.folder = info.folderNew
				user.posts_folder ? user.posts_folder : (user.posts_folder = [])

				user.posts_folder.push(info.folderNew)
				user.posts_folder = [...new Set(user.posts_folder)]
			} else if (info.folder) {
				post.folder = info.folder
			}
			user.posts.push(post)
			const updated = await user.save()
			const followersIdArr: string[] = []

			if (user.followers) {
				user.followers.forEach((follower: { _id: string; name: string }) => {
					followersIdArr.push(follower._id)
				})
			}

			const resFollow: UserInterface[] = await UserModel.find({
				_id: {
					$in: followersIdArr,
				},
			})

			const notice = {
				news_id: info._id,
				publisher: info.publisher,
				date: info.date,
				title: info.title,
				href: info.href,
				img: info.img,
				comment_date: info.commentDate,
				comment_title: info.commentTitle,
				comment: info.comment,
			}

			const updatedFollow: UserInterface[] = []
			resFollow.forEach((e) => e.notice.push(notice))
			resFollow.forEach(async (e) => {
				const update = await e.save()
				updatedFollow.push(update)
			})
			return [updated, updatedFollow]
		} catch (error) {
			throw error
		}
	}

	getPosts = async (id: string, page: number, folder: string) => {
		try {
			let query
			let select = ''

			if (folder === 'All' || folder === 'Default') {
				query = {
					_id: new ObjectId(id),
				}
				select = 'posts -_id'
			} else {
				query = {
					_id: new ObjectId(id),
					'posts.folder': folder,
				}
				select = 'posts.$ -_id'
			}

			const posts: UserInterface = (
				await UserModel.find(query, select)
					.limit(13)
					.skip(12 * page)
					.sort('comment_date')
			)[0]

			const result: { posts: object[] | null; nextPage: number | null } = {
				posts: null,
				nextPage: null,
			}
			let nextPage = null

			if (posts) {
				if (posts.posts[12]) nextPage = page + 2
				if (posts.posts.length == 13) posts.posts.pop()
				result.posts = posts.posts
			}

			result.nextPage = nextPage
			return result
		} catch (error) {
			throw error
		}
	}

	deletePost = async (userId: string, postId: string) => {
		try {
			const result = await UserModel.updateOne(
				{
					'posts._id': postId,
				},
				{
					$pull: {
						posts: {
							_id: postId,
						},
					},
				},
			)

			return result
		} catch (error) {
			throw error
		}
	}

	deletePostFold = async (info: { userId: string; folder: string }) => {
		try {
			const { userId, folder } = info

			const result = await UserModel.updateOne(
				{
					_id: userId,
				},
				{
					$pull: {
						posts: {
							folder: folder,
						},
						posts_folder: folder,
					},
				},
			)
			return result
		} catch (error) {
			throw error
		}
	}
}

export = new PostsDb()
