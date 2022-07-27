'use strict'
import { publicApi, privateApi } from './infra/apis'
import config from './infra/config.js'
const postContainer = document.querySelector('.postContainer')
const postsFolderTitle = document.querySelector('.postsFolderTitle')
const postsFolder = document.querySelector('.postsFolder')
const noMoreData = document.querySelector('.noMoreDataPost')
const url = new URL(window.location)
const userId = url.search.split('=')[1]
const follow = {}
follow.id = userId

const getPublicInfo = async (userId) => {
	await fetch(config.api.user.publicProfile + `?userId=${userId}`)
		.then(function (response) {
			return response.json()
		})
		.then(async function (dataJson) {
			renderPublic(dataJson.data)
		})
}

postsFolder.onchange = function () {
	postsFolderTitle.innerText = postsFolder.value
	getPost(postsFolder.value, userId)
}

const renderPublic = (data) => {
	createPostsFolder(data.postsFolder)
	const followSum = document.querySelector('.followSum')
	followSum.innerText = data.followers.length
	const userImgDefault = document.querySelector('.userImgDefault')
	const userName = document.querySelector('.userName')
	const userIntro = document.querySelector('textarea')
	userName.innerText = data.name

	follow.name = data.name

	if (data.intro !== 'undefined' || null) {
		userIntro.innerText = data.intro
	} else {
		userIntro.innerText = '喜歡科技的陽光宅宅'
	}

	if (data.picture !== null) {
		userImgDefault.style.display = 'none'
		$('#userImg').attr(
			'src',
			config.images.users.profilePictureBase + data.picture,
		)
	}
	createPost(data.posts)
}

const createPostsFolder = (postsFolderArr) => {
	if (postsFolderArr.length > 0 && postsFolderArr != 'undefined') {
		postsFolderArr.forEach((e, index) => {
			const option = document.createElement('option')
			option.id = 'postsFolder' + '_' + (index + 2)
			option.innerHTML = e
			postsFolder.appendChild(option)
		})
	}
}

const createPost = (dataJson) => {
	if (dataJson && dataJson.length > 0) {
		noMoreData.style.display = 'none'
		const postsSum = document.querySelector('.postsSum')
		postsSum.innerText = dataJson.length
		dataJson.forEach((e, index) => {
			const proNews = document.createElement('a')
			const relWrapper = document.createElement('a')
			const relTime = document.createElement('div')
			const relTitle = document.createElement('h6')
			const commentTitle = document.createElement('h6')
			const comContent = document.createElement('p')
			const source = document.createElement('a')
			proNews.className = 'proNews'
			relWrapper.className = 'relWrapper'
			relTime.className = 'relTime'
			relTime.innerText = e.comment_date.slice(0, 10)
			relTitle.innerText = e.title
			commentTitle.innerText = e.comment_title
			relTitle.className = 'relTitle'
			commentTitle.className = 'comTitle'
			comContent.className = 'comContent'
			comContent.innerText = e.comment
			source.className = 'clipCorner'
			relWrapper.href = '/newsDetails.html?title=' + encodeURIComponent(e.title)
			relWrapper.appendChild(relTime)
			relWrapper.appendChild(relTitle)
			relWrapper.appendChild(commentTitle)
			relWrapper.appendChild(comContent)
			proNews.appendChild(source)
			proNews.appendChild(relWrapper)
			postContainer.appendChild(proNews)
		})
	} else {
		noMoreData.style.display = 'flex'
	}
}

const getPost = async (folder, userId) => {
	postContainer.innerHTML = ''
	const noMoreData = document.querySelector('.noMoreDataPost')

	const { data: dataJson } = (
		await publicApi({
			url: config.api.user.posts + `?userId=${userId}&page=1&folder=${folder}`,
			method: 'GET',
		})
	).data
	createPost(dataJson.posts)
}

const followBtn = document.querySelector('.followBtn')
followBtn.addEventListener('click', async function () {
	this.classList.toggle('followed')
	const userInfoJson = localStorage.getItem('techBase')
	let localUserInfo
	if (userInfoJson) {
		localUserInfo = JSON.parse(userInfoJson)
	}
	const { id, name } = localUserInfo

	const { data } = (
		await privateApi({
			url: config.api.user.follow,
			method: 'POST',
			data: JSON.stringify({
				user_name: name,
				followId: follow.id,
				followName: follow.name,
			}),
		})
	).data
})

const renderProfile = () => {
	renderUserImg()
	getPost('All', userId)
	getFolders()
}

getPublicInfo(userId)

export { renderProfile }
