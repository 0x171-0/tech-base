import {
	Request,
	Response,
	NextFunction as Next,
	RequestHandler,
} from 'express'

export { Request, Response, Next, RequestHandler }

export interface TechBaseRouter {
	(req: Request, res: Response, next: Next): any
}
