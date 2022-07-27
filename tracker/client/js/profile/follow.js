'use strict'
import { privateApi } from '../infra/apis.js'
import config from '../infra/config.js'
import { createPostsOrBookmarks } from './reviewSystem/index.js'

export const getFollow = async () => {
	const followContainer = document.querySelector('#followContainer')
	followContainer.innerHTML = ''
	const { id: userId } = JSON.parse(localStorage.getItem('techBase'))

	const { data } = (
		await privateApi({
			url: config.api.user.follow + `?page=1`,
			method: 'GET',
		})
	).data

	const noMoreData = document.querySelector('.noMoreDataFollow')
	if (!data.notice || !data.notice.length) {
		noMoreData.style.display = 'flex'
		return
	}
	noMoreData.style.display = 'none'
	createPostsOrBookmarks(data.notice, unFollow, followContainer)
}

const unFollow = async () => {
	const { id: userId } = JSON.parse(localStorage.getItem('techBase'))
	const noticeID = event.currentTarget.id
	const { data } = (
		await privateApi({
			url: config.api.user.follow,
			method: 'DELETE',
			data: JSON.stringify({
				noticeID: noticeID.slice(3),
			}),
		})
	).data
}
