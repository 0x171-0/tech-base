import { TechBaseRouter } from '../../infra/interfaces/express'
import UserDb from '../../db/modules/user/users'
import { UserInterface } from '../../db/models/UserModel'
import { ErrorHandler } from '../../middleWares/errorHandler'
import { ErrorType } from '../../infra/enums/errorType'
const validator = require('validator')
import config from 'config'
const expire: number = config.get('token.expireTime') // 30 days by seconds
const tag = '/controller/user/users'
import logger from '../../utils/logger'

class User {
	signUp: TechBaseRouter = async (req, res) => {
		const _tag = tag + 'signUp'

		let { name, email, password } = req.body
		try {
			if (!validator.isEmail(email)) {
				throw new ErrorHandler(
					400,
					ErrorType.ValidationError,
					'Request Error: Invalid email format',
				)
			}

			name = validator.escape(name)

			const { access_token, loginAt, user } = await UserDb.signUp(
				name,
				email,
				password,
			)

			if (!user) {
				throw new ErrorHandler(
					500,
					ErrorType.DatabaseError,
					'Database Query Error',
				)
			}

			res.status(200).send({
				result: 'success',
				data: {
					access_token: access_token,
					access_expired: config.get('token.expireTime'),
					login_at: loginAt,
					id: user.id,
					provider: user.provider,
					name: user.name,
					email: user.email,
					picture: user.picture,
					posts_folder: user.posts_folder,
					books_folder: user.books_folder,
				},
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: { name, email, password, expire },
				msg: 'Fail to sign up',
				error,
			})
		}
	}

	nativeSignIn = async (email: string, password: string) => {
		const _tag = tag + 'nativeSignIn'
		try {
			if (!email || !password) {
				throw new ErrorHandler(
					400,
					ErrorType.PermissionError,
					'Request Error: email and password are required.',
				)
			}
			return await UserDb.nativeSignIn(email, password)
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: { email, password },
				error,
			})
			throw error
		}
	}

	signIn: TechBaseRouter = async (req, res, next) => {
		const _tag = tag + 'signIn'
		const data = req.body

		let result: {
			access_token?: string
			loginAt?: Date
			user?: UserInterface
			error?: any
		}
		try {
			switch (data.provider) {
				case 'native':
					result = await this.nativeSignIn(data.email, data.password)

					break
				default:
					result = {
						error: 'Wrong Request',
					}
			}

			if (result.error) {
				throw new ErrorHandler(400, ErrorType.PermissionError, result.error)
			}

			const { access_token, loginAt, user } = result

			if (!user) {
				throw new ErrorHandler(
					500,
					ErrorType.DatabaseError,
					'Database Query Error',
				)
			}

			res.status(200).send({
				result: 'success',
				data: {
					access_token: access_token,
					access_expired: config.get('token.expireTime'),
					login_at: loginAt,
					id: user.id,
					provider: user.provider,
					name: user.name,
					email: user.email,
					picture: user.picture,
					posts_folder: user.posts_folder,
					books_folder: user.books_folder,
				},
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: data,
				msg: 'Fail to signIn',
				error,
			})
			next(error)
		}
	}

	getUserProfile: TechBaseRouter = async (req, res, next) => {
		const _tag = tag + 'getUserProfile'
		const access_token = req.get('Authorization')
		try {
			if (!access_token) {
				throw new ErrorHandler(
					400,
					ErrorType.PermissionError,
					'Wrong Request: authorization is required.',
				)
			}
			const profile = await UserDb.getUserProfile(access_token)
			if (profile.error) {
				res.status(403).send({
					error: profile.error,
				})
				return
			} else {
				res.status(200).send({
					result: 'success',
					data: profile,
				})
			}
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: { access_token },
				error,
			})
			next(error)
		}
	}

	getFolders: TechBaseRouter = async (req, res, next) => {
		const _tag = tag + 'getFolders'
		const userId = req.me.id
		const userFolders = await UserDb.getFolders(userId)
		try {
			res.status(200).send({
				result: 'success',
				data: userFolders,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: { userId, userFolders },
				error,
			})
			next(error)
		}
	}

	publicInfo: TechBaseRouter = async (req, res, next) => {
		const _tag = tag + 'publicInfo'
		const userId = req.query.userId as string
		try {
			let result = await UserDb.publicInfo(userId)
			res.status(200).send({
				result: 'success',
				data: result,
			})
		} catch (error) {
			logger.error({
				tag: _tag,
				requireInfo: { userId },
				msg: 'Fail to get public info',
				error,
			})
			next(error)
		}
	}
}

export = new User()
