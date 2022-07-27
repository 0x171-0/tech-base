import { ObjectId } from 'mongodb'
import { UserInterface, UserModel } from '../../models/UserModel'

class FollowDb {
	follow = async (info: {
		userId: string
		userName: string
		followId: string
		followName: string
	}) => {
		try {
			const { userId, userName, followId, followName } = info
			return [
				await this._addFollowingsToUserList(userId, followId, followName),
				await this._addFollowerToUserList(userId, followId, userName),
			]
		} catch (error) {
			throw error
		}
	}

	_addFollowingsToUserList = async (
		userId: string,
		followId: string,
		followName: string,
	) => {
		try {
			const userFollowing: UserInterface | null = await UserModel.findOne({
				_id: new ObjectId(userId),
			}).exec()

			const follow = {
				_id: followId,
				name: followName,
			}

			if (!userFollowing) return

			userFollowing.follow.push(follow)
			const updated = await userFollowing.save()
		} catch (error) {
			throw error
		}
	}

	_addFollowerToUserList = async (
		userId: string,
		followId: string,
		userName: string,
	) => {
		try {
			const userBeFollowed: UserInterface | null = await UserModel.findOne({
				_id: new ObjectId(followId),
			})
			if (!userBeFollowed || !userBeFollowed.followers) return
			const followers = {
				_id: userId,
				name: userName,
			}
			userBeFollowed.followers.push(followers)
			const updatedFollow = await userBeFollowed.save()
		} catch (error) {
			throw error
		}
	}

	getFollow = async (id: string, page: number) => {
		try {
			const user: UserInterface | null = (
				await UserModel.find(
					{
						_id: new ObjectId(id),
					},
					'notice -_id',
				)
					.limit(13)
					.skip(12 * page)
					.sort('comment_date')
			)[0]

			let nextPage = null
			if (user.notice[12]) nextPage = page + 2
			if (user.notice.length == 13) user.notice.pop()
			return { notice: user.notice, nextPage }
		} catch (error) {
			throw error
		}
	}

	deleteFollow = async (userId: string, noticeID: string) => {
		try {
			const user = await UserModel.updateOne(
				{
					'notice._id': noticeID,
				},
				{
					$pull: {
						notice: {
							_id: noticeID,
						},
					},
				},
			)
			return user
		} catch (error) {
			throw error
		}
	}
}

export = new FollowDb()
