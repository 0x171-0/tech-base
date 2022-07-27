'use strict'
import config from '../../infra/config.js'
import { getBookmark, createBooksFolder } from './bookmark.js'
import { createPostsFolder, getPost } from './post.js'
import { privateApi } from '../../infra/apis.js'
const postFoldDeleteBtn = document.querySelector('.postsFolderDelete')
const bookmarkFoldDeleteBtn = document.querySelector('.booksFolderDelete')
bookmarkFoldDeleteBtn.addEventListener('click', function () {
	alertFolderDelete('bookmarks')
})
postFoldDeleteBtn.addEventListener('click', function () {
	alertFolderDelete('posts')
})

const alertFolderDelete = (folder) => {
	const swalWithBootstrapButtons = Swal.mixin({
		customClass: {
			confirmButton: 'btn btn-success',
			cancelButton: 'btn btn-danger',
		},
		buttonsStyling: false,
	})
	swalWithBootstrapButtons
		.fire({
			title: 'Are you sure to delete the folder?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'No, cancel!',
			reverseButtons: true,
		})
		.then((result) => {
			if (result.value) {
				swalWithBootstrapButtons.fire(
					'Deleted!',
					'Your folder has been deleted.',
					'success',
				)
				if (folder == 'posts') {
					folderDelete('postsFolder', 'postFold')
				} else {
					folderDelete('booksFolder', 'bookFold')
				}
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				swalWithBootstrapButtons.fire(
					'Cancelled',
					'Your folder is safe :)',
					'error',
				)
			}
		})
}

const folderDelete = async (selection, deleteUrl) => {
	const folderContainer = document.querySelector(`.${selection}`)
	const folderId = selection + '_' + folderContainer.selectedIndex
	const folderTitle = document.querySelector(`.${selection}Title`)
	const folderOp = document.querySelector(`#${folderId}`)
	folderOp.remove()
	const folder = folderTitle.innerText

	const { data } = (
		await privateApi({
			url: `/api/1.0/user/${deleteUrl}`,
			method: 'DELETE',
			data: JSON.stringify({
				folder: folder,
			}),
		})
	).data

	if (deleteUrl === 'postFold') {
		getPost()
	} else {
		getBookmark()
	}

	folderTitle.innerText = folderContainer.value
}

export const getFolders = async () => {
	const { data } = (
		await privateApi({
			url: config.api.user.folders,
			method: 'GET',
		})
	).data

	createBooksFolder(data.booksFolder)
	createPostsFolder(data.postsFolder)
	const followSum = document.querySelector('.followSum')
	followSum.innerText = data.followers.length
}

export const createPostsOrBookmarks = (data, deleteFunction, container) => {
	data.forEach((e, index) => {
		const postsTemp = document.getElementsByTagName('template')[0]
		const postsTemplateClone = postsTemp.content.cloneNode(true)
		postsTemplateClone.querySelector('.relWrapper').href =
			'/newsDetails.html?title=' + encodeURIComponent(e.title)
		postsTemplateClone.querySelector('.relTitle').innerText = e.title
		postsTemplateClone.querySelector(
			'.relTime',
		).innerText = e.comment_date.slice(0, 10)
		postsTemplateClone.querySelector('.comTitle').innerText = e.comment_title
		postsTemplateClone.querySelector('.comContent').innerText = e.comment
		const clip = postsTemplateClone.querySelector('.clip')
		clip.id = 'ID_' + e._id
		clip.style.zIndex = 9999
		clip.addEventListener('click', deleteFunction)
		clip.addEventListener('click', function (event) {
			event.currentTarget.parentNode.style.display = 'none'
		})
		container.appendChild(postsTemplateClone)
	})
}
