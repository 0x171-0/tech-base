import { ErrorType } from '../../infra/enums/errorType'
import { customErrors } from '../../infra/customErrors'
import { ErrorRequestHandler } from 'express'

export class ErrorHandler extends Error {
	statusCode: number
	errorType: ErrorType
	message: string

	constructor(statusCode: number, errorType: ErrorType, message: string) {
		super()
		this.statusCode = statusCode
		this.errorType = errorType
		this.message = message
	}
}

export const handleError: ErrorRequestHandler = (err, req, res, next) => {
	const { statusCode, errorType, message } = err

	const returnCustomError =
		customErrors[err.message as keyof typeof customErrors] ||
		customErrors.INTERNAL_SERVER_ERROR

	const data = err.data ? err.data : message

	res.status(
		statusCode ||
			returnCustomError.status ||
			customErrors.INTERNAL_SERVER_ERROR.status
	)
	res.send({
		result: 'fail',
		errorType: errorType,
		error: { type: returnCustomError.type, data },
	})
}
