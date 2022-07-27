import { ObjectId } from 'mongodb'
import { UserModel, UserInterface } from '../../models/UserModel'

class HistoryDb {
	getHistory = async (id: string, page: number) => {
		try {
			const histories: UserInterface = (
				await UserModel.find(
					{
						_id: new ObjectId(id),
					},
					'history -_id',
				)
					.limit(7)
					.skip(6 * page)
					.sort('brose_date')
			)[0]

			return histories
		} catch (error) {
			throw error
		}
	}

	addHistory = async (info: {
		broseDate?: Date
		_id?: string
		publisher?: string
		date?: string
		title?: string
		href?: string
		content?: string
		tags?: string[]
		userId?: string
		userEmail?: string
		userName?: string
	}) => {
		try {
			const updated = await UserModel.updateOne(
				{
					_id: new ObjectId(info.userId),
					'history._id': info._id,
				},
				{
					$set: {
						'history.0.brose_date': info.broseDate,
					},
				},
			)
			if (updated.nModified == 0) {
				const histories: any = await UserModel.findOne({
					_id: new ObjectId(info.userId),
				})
				const history = {
					_id: info._id,
					brose_date: info.broseDate,
					date: info.date,
					publisher: info.publisher,
					title: info.title,
					href: info.href,
					content: info.content,
					tags: info.tags,
				}
				histories.history.push(history)
				const addUpdated = await histories.save()
				return addUpdated
			}
			return updated
		} catch (error) {
			throw error
		}
	}

	deleteHistory = async (userId: string, historyId: string) => {
		try {
			const histories = await UserModel.updateOne(
				{
					'history._id': historyId,
				},
				{
					$pull: {
						history: {
							_id: historyId,
						},
					},
				},
			)
			return histories
		} catch (error) {
			throw error
		}
	}
}

export = new HistoryDb()
