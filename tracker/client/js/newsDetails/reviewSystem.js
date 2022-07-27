'use strict'
import config from '../infra/config.js'
import { privateApi } from '../infra/apis.js'
const reviewSystemContainer = document.querySelector('.reviewSystemContainer')
const reviewSystemForm = document.querySelector('.reviewSystemForm')
const reviewSystemTheme = document.querySelector('#reviewSystemTheme')
const bookmarkIcon = document.querySelector('.bookmarkIcon')
const postIcon = document.querySelector('.postIcon')
const closeIcon = document.querySelector('.closeIcon')
const formColumnTitleInput = document.querySelector('#form-column-title-input')
const formColumnContentTextArea = document.querySelector(
	'#form-column-content-text-area',
)
const reviewSystemBackground = document.querySelector('.reviewSystemBackground')
const uploadSuccessContainer = document.querySelector('.uploadSuccessContainer')
const select = document.querySelector('select')
const inputFolder = document.querySelector('#inputFolder')

const setFolder = () => {
	inputFolder.style.width = '10%'
	select.style.width = '90%'
	inputFolder.placeholder = '+'
	inputFolder.value = ''
	inputFolder.style.backgroundColor = '#5fcf80'
	inputFolder.style.color = 'white'
	select.style.color = 'grey'
	select.selectedIndex = 0
}

const createFolders = (foldersArr) => {
	select.innerHTML = ''
	if (!foldersArr.length || !foldersArr) return
	const defaultOption = document.createElement('option')
	defaultOption.innerHTML = 'Default'
	select.appendChild(defaultOption)
	foldersArr.forEach((e) => {
		const option = document.createElement('option')
		option.innerHTML = e
		select.appendChild(option)
	})
}

const getFolders = async (postsOrBookmark) => {
	const { data: dataJson } = (
		await privateApi({
			url: config.api.user.folders,
			method: 'GET',
		})
	).data

	if (postsOrBookmark === 'Posts' && dataJson.postsFolder.length) {
		createFolders(dataJson.postsFolder)
	} else if (postsOrBookmark === 'Bookmarks' && dataJson.booksFolder.length) {
		createFolders(dataJson.booksFolder)
	}
}

const addBookmark = (event) => {
	const postsOrBookmark = event.currentTarget.id

	getFolders(postsOrBookmark)
	reviewSystemTheme.innerText = event.currentTarget.id
	event.currentTarget.classList.toggle('bookmarkIconAdded')
	reviewSystemBackground.style.display = 'block'
	reviewSystemContainer.style.display = 'block'
}

const postForm = async (formData) => {
	const { data } = (
		await privateApi({
			method: 'POST',
			url: `/api/1.0/user/${reviewSystemTheme.innerText.toLowerCase()}`,
			data: JSON.stringify(formData),
		})
	).data

	uploadSuccessContainer.style.display = 'flex'

	setTimeout(() => {
		reviewSystemBackground.style.display = 'none'
		reviewSystemContainer.style.display = 'none'
		uploadSuccessContainer.style.display = 'none'
	}, 1000)
}

reviewSystemForm.addEventListener('submit', (event) => {
	event.preventDefault()
	const formData = new FormData(event.currentTarget)
	formColumnContentTextArea.value = ''
	formColumnTitleInput.value = ''
	setFolder()
	const { publisher, _id, date, title, href, img, content, tags } = JSON.parse(
		sessionStorage.getItem('newsInfo'),
	)
	const { id: userId, email: userEmail, name: userName } = JSON.parse(
		localStorage.getItem('techBase'),
	)
	formData.set('_id', _id)
	formData.set('commentDate', new Date())
	formData.set('publisher', publisher)
	formData.set('date', date)
	formData.set('title', title)
	formData.set('href', href)
	formData.set('img', img)
	formData.set('content', content)
	formData.set('tags', tags)
	formData.set('userId', userId)
	formData.set('userEmail', userEmail)
	formData.set('userName', userName)

	const commentData = {}
	for (const pair of formData.entries()) {
		commentData[pair[0]] = pair[1]
	}
	postForm(commentData)
})

inputFolder.addEventListener('click', () => {
	inputFolder.style.width = '90%'
	inputFolder.placeholder = 'Add a new folder'
	inputFolder.style.backgroundColor = 'white'
	inputFolder.style.color = 'black'
	select.style.width = '10%'
	select.style.color = 'transparent'
})

select.addEventListener('click', setFolder)
closeIcon.addEventListener('click', () => {
	reviewSystemBackground.style.display = 'none'
	reviewSystemContainer.style.display = 'none'
})

bookmarkIcon.addEventListener('click', addBookmark)
postIcon.addEventListener('click', addBookmark)
