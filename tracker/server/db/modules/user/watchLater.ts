import { ObjectId } from 'mongodb'
import { UserModel, UserInterface } from '../../models/UserModel'

class watchLaterDb {
	getWatchLater = async (id: string, page: number) => {
		try {
			const watchLater: UserInterface = (
				await UserModel.find(
					{
						_id: new ObjectId(id),
					},
					'watch_later -_id',
				)
					.limit(7)
					.skip(6 * page)
					.sort('_id')
			)[0]

			let result = { watchLater: watchLater.watch_later }

			return result
		} catch (error) {
			throw error
		}
	}

	addWatchLater = async (info: {
		userId: string
		newsId: string
		broseDate: Date
		date: Date
		title: string
		href: string
		content: object[]
	}) => {
		try {
			const { userId, newsId, broseDate, date, title, href, content } = info

			const updated = await UserModel.updateOne(
				{
					_id: new ObjectId(info.userId),
					'watch_later._id': info.newsId,
				},
				{
					$set: {
						'watch_later.0.brose_date': info.broseDate,
					},
				},
			)

			if (updated.nModified == 0) {
				const watchLaters: UserInterface | null = await UserModel.findOne({
					_id: new ObjectId(info.userId),
				})
				if (!watchLaters) return
				const watchLater = {
					_id: newsId,
					brose_date: broseDate,
					date: date,
					title: title,
					href: href,
					content: content,
				}
				watchLaters.watch_later.push(watchLater)
				const addUpdated = await watchLaters.save()
				return addUpdated
			}
			return updated
		} catch (error) {
			throw error
		}
	}

	deleteWatchLater = async (userId: string, watchLaterId: number) => {
		try {
			const result = await UserModel.updateOne(
				{
					'watch_later._id': watchLaterId,
				},
				{
					$pull: {
						watch_later: {
							_id: watchLaterId,
						},
					},
				},
			)
			return result
		} catch (error) {
			throw error
		}
	}
}

export = new watchLaterDb()
