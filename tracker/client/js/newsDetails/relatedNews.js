'use strict'
import config from '../infra/config.js'
import { publicApi, privateApi } from '../infra/apis.js'
const startTime = '2007-07-07'
const endTime = new Date()

export async function getRelatedNews({ relatedTitle, getUntilPage }) {
	while (getUntilPage > 0) {
		const { data: dataJson } = (
			await publicApi({
				url:
					config.api.news.search +
					`?search=${relatedTitle}&page=${getUntilPage}`,
				method: 'GET',
			})
		).data

		const relatedContainer = document.querySelector('.relContainer')
		dataJson.news.forEach((e, index) => {
			if (relatedTitle === e.title) return
			const relatedTemplated = document.getElementsByTagName('template')[2]
			const relatedNewsClone = relatedTemplated.content.cloneNode(true)
			relatedNewsClone.querySelector('.relTime').innerText = e.date.slice(0, 10)
			relatedNewsClone.querySelector('.relTitle').innerText = e.title
			relatedNewsClone.querySelector(
				'.relatedNewsInfoContainer',
			).href = `/newsDetails.html?title=${e.title}`
			relatedNewsClone.querySelector('.relContent').innerText =
				e.content[0].content
			const clip = relatedNewsClone.querySelector('.clip')
			clip.id = `ID_${e._id}`
			clip.addEventListener('click', addWatchLater)
			relatedContainer.appendChild(relatedNewsClone)
		})
		getUntilPage--
	}
}

async function addWatchLater(event) {
	const relDiv = event.currentTarget.parentNode
	event.currentTarget.classList.toggle('clipAdded')
	const relatedNewsInfoContainer = relDiv.children[1]
	const { id: userId } = JSON.parse(localStorage.getItem('techBase'))
	const info = {
		newsId: event.currentTarget.id.slice(3),
		userId,
		broseDate: new Date(),
		date: relatedNewsInfoContainer.children[0].innerText,
		title: relatedNewsInfoContainer.children[1].innerText,
		href: relatedNewsInfoContainer.href,
		content: relatedNewsInfoContainer.children[2].innerText,
	}

	const { data } = (
		await privateApi({
			url: config.api.user.watchLater,
			method: 'POST',
			data: JSON.stringify(info),
		})
	).data
}
