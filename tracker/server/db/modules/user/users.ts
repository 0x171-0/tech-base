import { ObjectId } from 'mongodb'
import { UserModel, UserInterface } from '../../models/UserModel'
import config from 'config'
import bcrypt from 'bcrypt'
import { ErrorHandler } from '../../../middleWares/errorHandler'
import { ErrorType } from '../../../infra/enums/errorType'
import TokenHelper from '../../../helpers/token'

const salt = parseInt(config.get('bcrypt.salt'))

class UserDb {
	publicInfo = async (userId: string) => {
		try {
			const results: UserInterface = (
				await UserModel.find(
					{
						_id: new ObjectId(userId),
					},
					'_id name picture posts posts_folder intro followers bookmarks',
				)
			)[0]
			if (!results) {
				return {
					error: 'Invalid User ID',
				}
			} else {
				return {
					data: {
						user_id: results._id,
						name: results.name,
						picture: results.picture,
						posts: results.posts,
						postsFolder: results.posts_folder,
						intro: results.intro,
						followers: results.followers,
						bookmarks: results.bookmarks,
					},
				}
			}
		} catch (error) {
			throw error
		}
	}

	signUp = async (name: string, email: string, password: string) => {
		try {
			const emails = await this.findUserByEmail(email)
			if (emails.length > 0) {
				throw new ErrorHandler(
					400,
					ErrorType.ClientError,
					'Email Already Exists',
				)
			}

			const loginAt = new Date()
			const access_token = TokenHelper.generateToken({ email, loginAt })

			const user = {
				id: '',
				provider: 'native',
				email: email,
				password: bcrypt.hashSync(password, salt),
				name: name,
				picture: undefined,
				intro: undefined,
				access_token: access_token,
				access_expired: config.get('token.expireTime'),
				login_at: loginAt,
				posts_folder: [],
				books_folder: [],
			}

			const result = await UserModel.create(user)
			user.id = result._id
			return {
				access_token,
				loginAt,
				user,
			}
		} catch (error) {
			throw error
		}
	}

	nativeSignIn = async (email: string, password: string) => {
		try {
			const users = await this.findUserByEmail(email)
			const user = users[0]
			if (!user) {
				return {
					error: 'Email is Wrong',
				}
			}
			if (!bcrypt.compareSync(password, String(user.password))) {
				return {
					error: 'Password is wrong',
				}
			}
			const loginAt = new Date()
			const access_token = TokenHelper.generateToken({ email, loginAt })

			await UserModel.updateOne(
				{
					_id: user.id,
				},
				{
					access_token: access_token,
					access_expired: config.get('token.expireTime'),
					login_at: loginAt,
				},
			)

			return {
				access_token,
				loginAt,
				user,
			}
		} catch (error) {
			throw error
		}
	}

	getUserProfile = async (access_token: string) => {
		try {
			const results: UserInterface = (
				await UserModel.find({ access_token }, {})
			)[0]
			if (!results) {
				return {
					error: 'Invalid Access Token',
				}
			} else {
				return {
					userId: results.id,
					provider: results.provider,
					name: results.name,
					email: results.email,
					picture: results.picture,
					intro: results.intro,
				}
			}
		} catch (error) {
			throw error
		}
	}

	findUserByEmail = async (email: string) => {
		try {
			const user: UserInterface[] = await UserModel.find({ email })
			return user
		} catch (error) {
			throw error
		}
	}

	getFolders = async (userId: string) => {
		try {
			const userInfo: UserInterface = (
				await UserModel.find(
					{ _id: new ObjectId(userId) },
					'_id  books_folder posts_folder followers',
				)
			)[0]
			if (!userInfo['_id']) {
				throw new ErrorHandler(
					500,
					ErrorType.DatabaseError,
					'Database Query Error',
				)
			}
			const result = {
				booksFolder: userInfo.books_folder,
				postsFolder: userInfo.posts_folder,
				followers: userInfo.followers,
			}
			return result
		} catch (error) {
			throw error
		}
	}
}

export = new UserDb()
