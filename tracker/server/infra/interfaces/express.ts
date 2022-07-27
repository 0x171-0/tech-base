import {
	Request,
	Response,
	NextFunction as Next,
	RequestHandler,
} from 'express'

export { Request, Response, Next, RequestHandler }

export interface TechBaseRouter {
	(req: TechBaseRequest, res: Response, next: Next): any
}

export interface TechBaseRequest extends Request {
	me?: any
}
