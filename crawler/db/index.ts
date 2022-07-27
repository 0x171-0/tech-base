import { NewsModule } from './Modules/news'

export class DB {
	NewsModel: NewsModule
	constructor() {
		this.NewsModel = new NewsModule()
	}
}
