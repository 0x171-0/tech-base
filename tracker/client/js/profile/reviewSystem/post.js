'use strict'
import config from '../../infra/config.js'
import { createPostsOrBookmarks } from './index.js'
import { privateApi } from '../../infra/apis.js'

const postContainer = document.querySelector('.postContainer')
const postsFolder = document.querySelector('.postsFolder')
const postsFolderTitle = document.querySelector('.postsFolderTitle')

export const getPost = async (folder) => {
	const folderUrl = folder || 'All'
	postContainer.innerHTML = ''
	const { data } = (
		await privateApi({
			url: config.api.user.posts + `?page=1&folder=${folderUrl}`,
			method: 'GET',
		})
	).data

	const noMoreData = document.querySelector('.noMoreDataPost')
	if (!data.posts || !data.posts.length) {
		noMoreData.style.display = 'flex'
		return
	}
	noMoreData.style.display = 'none'
	const postsSum = document.querySelector('.postsSum')
	postsSum.innerText = data.posts.length
	createPostsOrBookmarks(data.posts, deletePost, postContainer)
}

export const deletePost = async (event) => {
	const postId = event.currentTarget.id
	const { data } = (
		await privateApi({
			url: config.api.user.posts,
			method: 'DELETE',
			data: JSON.stringify({
				postId: postId,
			}),
		})
	).data
}

export const createPostsFolder = (postsFolderArr) => {
	if (!postsFolderArr.length || !postsFolderArr) return
	postsFolderArr.forEach((e, index) => {
		const option = document.createElement('option')
		option.id = 'postsFolder' + '_' + (index + 2)
		option.innerHTML = e
		postsFolder.appendChild(option)
	})
}

postsFolder.onchange = function () {
	postsFolderTitle.innerText = postsFolder.value
	getPost(postsFolder.value)
}
