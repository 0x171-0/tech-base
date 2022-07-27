import { ObjectId } from 'mongodb'
import { UserModel } from '../../models/UserModel'

class ImagesDb {
	uploadImage = async (userId: string, imgUrl: string) => {
		try {
			const updated = await UserModel.updateOne(
				{
					_id: new ObjectId(userId),
				},
				{
					$set: {
						picture: imgUrl,
					},
				},
			)
			return updated
		} catch (error) {
			throw error
		}
	}

	deleteImg = async (userId: string) => {
		try {
			const deleteUrl = await UserModel.find(
				{
					_id: new ObjectId(userId),
				},
				'picture',
			)
			return deleteUrl
		} catch (error) {
			throw error
		}
	}
}

export = new ImagesDb()
