import { UserModel, UserInterface } from '../db/models/UserModel'
import config from 'config'
import { customErrors } from '../infra/customErrors'
import crypto from 'crypto'
import { UserRole } from '../infra/enums/UserRole'

class TokenHelper {
	async verifyToken(token: string) {
		try {
			const [identity, access_token] = (token || '').split(' ', 2)
			if (!identity) throw new Error(customErrors.AUTH_NO_IDENTITY.type)

			let email = ''
			const cipher = crypto.createDecipheriv(
				'aes-128-cbc',
				config.get('token.key'),
				config.get('token.iv'),
			)
			email += cipher.update(access_token, 'hex', 'utf8')
			email += cipher.final('utf8')

			const userPO: UserInterface[] = await UserModel.find({ email })

			return userPO[0]
		} catch (err) {
			throw err
		}
	}

	generateToken(opt: { email: string; loginAt?: Date; role?: string }) {
		try {
			const { email, loginAt = new Date(), role = UserRole.user } = opt

			let access_token = ''
			const cipher = crypto.createCipheriv(
				'aes-128-cbc',
				config.get('token.key'),
				config.get('token.iv'),
			)
			access_token += cipher.update(email, 'utf8', 'hex')
			access_token += cipher.final('hex')
			return role + ' ' + access_token
		} catch (err) {
			throw err
		}
	}
}

export = new TokenHelper()
