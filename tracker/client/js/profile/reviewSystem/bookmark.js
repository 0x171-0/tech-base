'use strict'
import config from '../../infra/config.js'
import { createPostsOrBookmarks } from './index.js'
import { privateApi } from '../../infra/apis.js'

const bookContainer = document.querySelector('#bookContainer')
const booksFolderTitle = document.querySelector('.booksFolderTitle')
const booksFolder = document.querySelector('.booksFolder')

export const getBookmark = async (folder) => {
	const folderUrl = folder || 'All'
	bookContainer.innerHTML = ''

	const { data } = (
		await privateApi({
			url: config.api.user.bookmarks + `?page=1&folder=${folderUrl}`,
			method: 'GET',
		})
	).data

	const noMoreData = document.querySelector('.noMoreDataBook')
	if (!data.bookmarks || !data.bookmarks.length) {
		noMoreData.style.display = 'flex'
		return
	}
	noMoreData.style.display = 'none'
	const bookSum = document.querySelector('.bookSum')
	bookSum.innerText = data.bookmarks.length
	createPostsOrBookmarks(data.bookmarks, deleteBookmark, bookContainer)
}

export const deleteBookmark = async (event) => {
	const bookmarkId = event.currentTarget.id
	const { data } = (
		await privateApi({
			url: config.api.user.bookmarks,
			method: 'DELETE',
			data: JSON.stringify({
				bookmarkId: bookmarkId,
			}),
		})
	).data
}

export const createBooksFolder = (booksFolderArr) => {
	if (!booksFolderArr.length || !booksFolderArr) return
	booksFolderArr.forEach((e, index) => {
		const option = document.createElement('option')
		option.id = 'booksFolder' + '_' + (index + 2)
		option.innerHTML = e
		booksFolder.appendChild(option)
	})
}

booksFolder.onchange = function () {
	booksFolderTitle.innerText = booksFolder.value
	getBookmark(booksFolder.value)
}
