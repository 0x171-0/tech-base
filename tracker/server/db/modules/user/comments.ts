import { NewsModel } from '../../models/NewsModel'
const { ObjectId } = require('mongodb')

class CommentsDb {
	getSumEmoji = async (info: { userId: string; contentId: string }) => {
		try {
			const { userId, contentId } = info

			const userEmoji = await NewsModel.aggregate([
				{
					$unwind: '$content',
				},
				{
					$match: {
						'content._id': ObjectId(contentId),
					},
				},
				{
					$unwind: '$content.emoji',
				},
				{
					$match: {
						'content.emoji.user_id': userId,
					},
				},
				{
					$group: {
						_id: {
							user: '$content.emoji.user_id',
							emoji: '$content.emoji.emoji',
						},
						count: {
							$sum: '$content.emoji.count',
						},
					},
				},
			])

			const totalEmoji = await NewsModel.aggregate([
				{
					$unwind: '$content',
				},
				{
					$match: {
						'content._id': ObjectId(contentId),
					},
				},
				{
					$unwind: '$content.emoji',
				},
				{
					$group: {
						_id: {
							emoji: '$content.emoji.emoji',
						},
						count: {
							$sum: '$content.emoji.count',
						},
					},
				},
			])

			const result = {
				userEmoji: userEmoji,
				totalEmoji: totalEmoji,
			}

			return result
		} catch (error) {
			throw error
		}
	}

	toggleEmoji = async (info: {
		userId: string
		contentId: string
		date: Date
		emoji: string
		userName: string
		intent: string
	}) => {
		try {
			const { intent } = info
			if (!intent) {
				return await this.addEmoji(info)
			} else {
				return await this.deleteEmoji(info)
			}
		} catch (error) {
			throw error
		}
	}

	addEmoji = async (info: {
		userId: string
		contentId: string
		date: Date
		emoji: string
		userName: string
	}) => {
		try {
			const { contentId, date, emoji, userId, userName } = info

			await NewsModel.updateOne(
				{
					'content._id': contentId,
				},
				{
					$push: {
						'content.$.emoji': {
							_id: userName + emoji,
							date: date,
							user_id: userId,
							user_name: userName,
							emoji: emoji,
							count: 1,
						},
					},
				},
			)
		} catch (error) {
			throw error
		}
	}

	deleteEmoji = async (info: { emoji: string; userName: string }) => {
		try {
			const { emoji, userName } = info

			return await NewsModel.updateOne(
				{
					'content.emoji._id': userName + emoji,
				},
				{
					$pull: {
						'content.$.emoji': {
							_id: userName + emoji,
						},
					},
				},
			)
		} catch (error) {
			throw error
		}
	}

	saveComment = async (
		userId: string,
		userName: string,
		contentId: string,
		comment: string,
		date: Date,
		picture: string,
	) => {
		try {
			const contentIdTrue = contentId.slice(3)
			const result = await NewsModel.updateOne(
				{
					'content._id': contentIdTrue,
				},
				{
					$push: {
						'content.$.comment': {
							date: date,
							user: [userId, userName],
							comment: comment,
							picture: picture,
						},
					},
				},
			)
		} catch (error) {
			throw error
		}
	}

	findComment = async (contentId: string) => {
		try {
			const commentArr = await NewsModel.aggregate([
				{
					$unwind: '$content',
				},
				{
					$unwind: '$content.comment',
				},
				{
					$match: {
						'content._id': ObjectId(contentId),
					},
				},
				{
					$group: {
						_id: '$content.comment',
					},
				},
			])

			return commentArr
		} catch (error) {
			throw error
		}
	}
}

export = new CommentsDb()
