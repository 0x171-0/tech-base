import { TechBaseRouter } from '../infra/interfaces/express'

class Error {
	get404: TechBaseRouter = async (req, res) => {
		res.redirect('/404.html')
	}
}

export = new Error()
