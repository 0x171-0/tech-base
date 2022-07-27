'use strict'
import config from '../infra/config.js'
import { createNewsAnalyticsReport } from './analyze.js'
import { createNewsContents } from './content.js'
import { getRelatedNews } from './relatedNews.js'
import { privateApi, publicApi } from '../infra/apis.js'
import Tab from '../components/tab.js'
new Tab()

fetchNewsAndRenderContents(window.location.href.split('?title=')[1])

async function fetchNewsAndRenderContents(newsTitle) {
	const newsInfoUrl = config.api.news.info

	const { data: dataJson } = (
		await publicApi({
			url: newsInfoUrl + `?title=${encodeURIComponent(newsTitle)}`,
			method: 'GET',
		})
	).data

	const {
		_id,
		title,
		publisher,
		date,
		href,
		content,
		positive,
		negative,
		terms,
		behaviors,
		comparative,
		calculation,
		tags,
		img,
	} = dataJson

	createNewsContents({ content, title, publisher, date, href })

	await getRelatedNews({ relatedTitle: newsTitle, getUntilPage: 2 })

	await createNewsAnalyticsReport({
		positive,
		negative,
		terms,
		behaviors,
		comparative,
		calculation,
		tags,
		date,
	})

	const dataToSession = {
		publisher,
		_id,
		date,
		title,
		href,
		img,
		content: content[0].content,
		tags: tags.map((e) => e.tags),
	}

	saveNewsToSession(dataToSession)
	await addBrowseHistory(dataToSession)
}

async function saveNewsToSession(newsInfo) {
	sessionStorage.setItem('newsInfo', JSON.stringify(newsInfo))
}

async function addBrowseHistory({
	publisher,
	_id,
	date,
	title,
	href,
	img,
	content,
	tags,
}) {
	try {
		const {
			access_token,
			id: userId,
			email: userEmail,
			name: userName,
		} = JSON.parse(localStorage.getItem('techBase'))
		if (!access_token) return

		const history = {
			broseDate: new Date(),
			_id,
			publisher,
			date,
			title,
			href,
			content,
			tags,
			userId,
			userEmail,
			userName,
		}
		const { data } = (
			await privateApi({
				url: config.api.user.history,
				method: 'POST',
				data: JSON.stringify(history),
			})
		).data
	} catch (error) {
		console.log(error)
	}
}
