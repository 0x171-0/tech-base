'use strict'
import config from '../infra/config.js'
import { privateApi, publicApi } from '../infra/apis.js'
export const emojiArr = [
	'0x1F44D',
	'0x1F60A',
	'0x1F60D',
	'0x1F602',
	'0x1F631',
	'0x1F621',
]
let currentParagraphId
const socket = io()
const commentThread = document.querySelector('.comment-thread')
const commentsBackground = document.querySelector('.commentsBackground')

const hideCommentsBackground = () => {
	const target = document.querySelector('.focusContent')
	if (!target) return
	const emojiBtnDiv = target.querySelector('.emojiBtnDiv')
	emojiBtnDiv.style.visibility = 'hidden'
	commentsBackground.style.display = 'none'
	target.style.zIndex = 0
	target.classList.remove('focusContent')
}
commentsBackground.addEventListener('click', hideCommentsBackground, true)

const renderComments = async (commentsArr) => {
	let commentHeight = 30
	const focusContent = document.querySelector('.focusContent')
	commentsArr.forEach((commentInfo, index) => {
		const commentItem = document.createElement('li')
		commentItem.classList.add('commentItem')
		commentItem.classList.add('moveFromLeftToRight')
		const text = document.createElement('div')
		const img = document.createElement('img')
		text.className = 'commentText'
		img.className = 'commentImg'
		const isValidImg = commentInfo[2] && commentInfo[2].length > 5
		if (isValidImg) {
			img.src = config.images.users.profilePictureBase + commentInfo[2]
		} else {
			img.src = config.images.news.comments.defaultUserIcon
		}
		text.innerText = commentInfo[1]
		commentItem.style.animationDuration =
			Math.floor(Math.random() * 10) + 25 + 's'
		commentHeight = commentHeight + 40 + Math.floor(Math.random() * 50)
		commentItem.style.top = commentHeight + 'px'
		commentItem.appendChild(img)
		commentItem.appendChild(text)
		commentItem.addEventListener('click', function () {
			window.location.href = '/publicProfile.html?id=' + commentInfo[0]
		})
		commentThread.appendChild(commentItem)
		while (detectCollision(commentItem, focusContent)) {
			commentItem.style.top = 10 + commentItem.style.top
		}
	})
}

function detectCollision(el1, el2, extra) {
	const rect1 = el1.getBoundingClientRect()
	const rect2 = el2.getBoundingClientRect()
	extra = extra || {
		y1: 0,
		y2: 0,
	}
	return (
		rect1.y < rect2.y + rect2.height + extra.y1 &&
		rect1.y + rect1.height > rect2.y + extra.y2
	)
}

const toggleEmoji = async (event) => {
	const randomID = Math.floor(Math.random() * 1000)
	const contentId = event.currentTarget.parentNode.parentNode.parentNode.id

	const { id: userId, name: userName } = JSON.parse(
		localStorage.getItem('techBase') || '',
	)
	const info = {
		date: new Date(),
		userId: userId || randomID,
		userName: 'userName' || 'randomUser',
		contentId: contentId.slice(3),
		emoji: event.currentTarget.id[2],
		intent: event.currentTarget.classList.contains('emojiAdd'),
	}
	if (info.intent) {
		event.currentTarget.classList.remove('emojiAdd')
		event.currentTarget.children[1].innerText =
			Number(event.currentTarget.children[1].innerText) - 1
	} else {
		event.currentTarget.classList.add('emojiAdd')
		event.currentTarget.children[1].innerText =
			Number(event.currentTarget.children[1].innerText) + 1
	}
	const { data } = (
		await privateApi.post(config.api.news.comments.toggleEmoji, info)
	).data
}

export const postComment = (event) => {
	const commentInput = event.currentTarget.previousElementSibling
	const comment = commentInput.value
	if (!comment) return false
	const contentDiv = document.querySelector(currentParagraphId)
	const randomID = Math.floor(Math.random() * 1000)
	commentInput.value = ''
	const { id: userId, name: userName, picture } = JSON.parse(
		localStorage.getItem('techBase'),
	)
	const contentId = event.currentTarget.parentNode.parentNode.parentNode.id
	socket.emit('postNewsComment', {
		userId: userId || randomID,
		userName: userName || 'randomUser',
		contentId,
		comment,
		date: new Date(),
		picture: picture || '',
	})
	renderComments([[userId || randomID, comment, picture || '']], contentDiv)
}

export const getComments = async (event) => {
	currentParagraphId = `#${event.currentTarget.id}`
	const contentDiv = document.querySelector(currentParagraphId)
	const data = []

	const { data: commentsArr } = (
		await publicApi({
			method: 'GET',
			url:
				config.api.news.comments.comment +
				'?content=' +
				`${event.currentTarget.id.slice(3)}`,
		})
	).data

	if (commentsArr && commentsArr.length > 0) {
		commentsArr.forEach(async (e) => {
			data.push([e._id.user[0], e._id.comment, e._id.picture])
			commentThread.innerHTML = ''
		})
		await renderComments(data, contentDiv)
	} else {
		commentThread.innerHTML = ''
		await renderComments(
			[
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
				['admin', '還沒有人留言呢！快來當第一個留言的吧', null],
			],
			contentDiv,
		)
	}
}

export const showCommentsBackground = async (event) => {
	const { id: userId } = JSON.parse(localStorage.getItem('techBase') || '')
	const info = {
		userId,
		contentId: event.currentTarget.id.slice(3),
	}
	const target = document.querySelector(`#${event.currentTarget.id}`)
	const emojiBtnDiv = document.querySelector(
		`#${event.currentTarget.id} > .emojiBtnDiv`,
	)
	emojiBtnDiv.style.visibility = 'visible'
	commentsBackground.style.display = 'block'
	target.style.zIndex = 3
	target.className += ' focusContent'

	const { data: emojisJson } = (
		await publicApi({
			method: 'GET',
			url:
				config.api.news.comments.getSumEmoji +
				`?contentId=${event.currentTarget.id.slice(3)}`,
		})
	).data

	emojisJson.userEmoji.forEach((e) => {
		const emojiId = `#E_${e._id.emoji}${info.contentId}`
		document.querySelector(emojiId).className += ' ' + 'emojiAdd'
	})
	emojisJson.totalEmoji.forEach((e) => {
		const emojiId = `#E_${e._id.emoji}${info.contentId}`
		document.querySelector(emojiId).children[1].innerText = e.count
	})
}

export const createEmojiFromTemplate = (newsParagraphId, index) => {
	const emojiTemplate = document.getElementsByTagName('template')[1]
	const emojiTemplateClone = emojiTemplate.content.cloneNode(true)
	const emojiContainer = emojiTemplateClone.querySelector('.emojiSpan')
	const emojiIcon = emojiTemplateClone.querySelector('.emojiText')
	const emojiCount = emojiTemplateClone.querySelector('.emojiCount')
	emojiContainer.id = `E_${index}${newsParagraphId}`
	emojiContainer.addEventListener('click', toggleEmoji)
	emojiIcon.innerText = String.fromCodePoint(emojiArr[index])
	emojiCount.innerText = '0'
	return emojiTemplateClone
}
