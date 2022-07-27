import { ObjectId } from 'mongodb'
import { UserModel, UserInterface } from '../../models/UserModel'
import { ErrorHandler } from '../../../middleWares/errorHandler'
import { ErrorType } from '../../../infra/enums/errorType'
import { customErrors } from '../../../infra/customErrors'

class BookmarkDb {
	addBookmark = async (info: {
		_id: string
		publisher: string
		date: Date
		title: string
		href: string
		img: string
		content: string
		tags: object[]
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

			const bookmark = {
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
				bookmark.folder = info.folderNew
				user.books_folder ? user.books_folder : (user.books_folder = [])
				user.books_folder.push(info.folderNew)
				user.books_folder = [...new Set(user.books_folder)]
			} else if (info.folder) {
				bookmark.folder = info.folder
			}
			user.bookmarks ? user.bookmarks : (user.bookmarks = [])
			user.bookmarks.push(bookmark)
			const updated = await user.save()
			return updated
		} catch (error) {
			throw error
		}
	}

	getBookmarks = async (id: string, page: number, folder: string) => {
		try {
			let query
			let select = ''
			if (folder == 'All') {
				query = {
					_id: new ObjectId(id),
				}
				select = 'bookmarks -_id'
			} else {
				query = {
					_id: new ObjectId(id),
					'bookmarks.folder': folder,
				}
				select = 'bookmarks.$ -_id'
			}
			const user: UserInterface | null = (
				await UserModel.find(query, select)
					.limit(13)
					.skip(12 * page)
					.sort('comment_date')
			)[0]

			let nextPage = null
			let result: any = {}

			if (user) {
				user.bookmarks ? user.bookmarks : (user.bookmarks = [])
				if (user.bookmarks[12]) nextPage = page + 2
				if (user.bookmarks.length == 13) user.bookmarks.pop()
				result.bookmarks = user.bookmarks
			} else {
				result.posts = null
			}
			return result
		} catch (error) {
			throw error
		}
	}

	deleteBookmark = async (userId: string, bookmarkId: number) => {
		try {
			const result = await UserModel.updateOne(
				{
					'bookmarks._id': bookmarkId,
				},
				{
					$pull: {
						bookmarks: {
							_id: bookmarkId,
						},
					},
				},
			)
			return result
		} catch (error) {
			throw error
		}
	}

	deleteBookFold = async (info: { userId: string; folder: string }) => {
		try {
			const { userId, folder } = info

			const result = await UserModel.updateOne(
				{
					_id: userId,
				},
				{
					$pull: {
						bookmarks: {
							folder: folder,
						},
						books_folder: folder,
					},
				},
			)

			return result
		} catch (error) {
			throw error
		}
	}
}

export = new BookmarkDb()
