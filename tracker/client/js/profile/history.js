'use strict'
import config from '../infra/config.js'
import { privateApi } from '../infra/apis.js'

export const getHistory = async () => {
	const profileTitle = document.querySelector('.profileTitle4')
	profileTitle.innerText = 'History'
	const { data } = (
		await privateApi({
			url: config.api.user.getHistory + `?page=1`,
			method: 'GET',
		})
	).data
	renderHistoryOrWatchLater(data.history, deleteHistory)
}

const deleteHistory = async (event) => {
	const historyId = event.currentTarget.id
	await privateApi({
		url: config.api.user.history,
		method: 'DELETE',
		data: JSON.stringify({
			historyId: historyId,
		}),
	})
}

const renderHistoryOrWatchLater = (data, deleteFunc) => {
	const noMoreData = document.querySelector('.noMoreDataWatch')
	const hisContainer = document.querySelector('.hisContainer')
	hisContainer.innerHTML = ''
	if (!data && !data.length) {
		noMoreData.style.display = 'flex'
		return
	}
	noMoreData.style.display = 'none'
	data.forEach((e, index) => {
		const historyTemp = document.getElementsByTagName('template')[1]
		const historyTemplateClone = historyTemp.content.cloneNode(true)
		historyTemplateClone.querySelector('.hisTime').innerText = e.date.slice(
			0,
			10,
		)
		historyTemplateClone.querySelector('.hisTitle').innerText = e.title
		historyTemplateClone.querySelector('.hisContent').innerText = e.content
		const relWrapper = historyTemplateClone.querySelector('.hisWrapper')
		relWrapper.href = '/newsDetails.html?title=' + encodeURIComponent(e.title)
		const clip = historyTemplateClone.querySelector('.clip')
		clip.id = 'ID_' + e._id
		clip.style.zIndex = 9999
		clip.addEventListener('click', deleteFunc)
		clip.addEventListener('click', function (event) {
			event.currentTarget.parentNode.style.display = 'none'
		})
		hisContainer.appendChild(historyTemplateClone)
	})
}

export const getWatchLater = async () => {
	const profileTitle = document.querySelector('.profileTitle4')
	profileTitle.innerText = 'Watch Later'

	const { data } = (
		await privateApi({
			url: config.api.user.watchLater + `?page=1`,
			method: 'GET',
		})
	).data

	renderHistoryOrWatchLater(data.watchLater, deleteWatchLater)
}

const deleteWatchLater = async () => {
	const watchLaterId = event.currentTarget.id
	const { data } = (
		await privateApi({
			url: config.api.user.watchLater,
			method: 'DELETE',
			data: JSON.stringify({
				watchLaterId: watchLaterId.slice(3),
			}),
		})
	).data
}

const getHistoryBtn = document.querySelector('.getHistory')
getHistoryBtn.addEventListener('click', getHistory)

const watchLaterBtn = document.querySelector('.watchLater')
watchLaterBtn.addEventListener('click', getWatchLater)
