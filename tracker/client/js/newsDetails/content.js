'use strict'
import {
	postComment,
	createEmojiFromTemplate,
	getComments,
	showCommentsBackground,
	emojiArr,
} from './commentSystem.js'

export const createNewsContents = async ({
	content,
	title,
	publisher,
	date,
	href,
}) => {
	document.querySelector('.tabTitle').innerText = title
	document.querySelector('#publisher').innerText = publisher
	document.querySelector('#publishDate').innerText = date.slice(0, 10)
	document.querySelector('#goSourceWeb').href = href

	const container = document.querySelector('.newsContainer')
	content.forEach((news, index) => {
		if (!news.content.length || news.content[0] === '<') return
		const contentTemplateClone = document
			.getElementsByTagName('template')[0]
			.content.cloneNode(true)

		contentTemplateClone.querySelector('p').innerText = news.content
		const inputButton = contentTemplateClone.querySelector('button')
		inputButton.innerText = 'Submit'
		const input = contentTemplateClone.querySelector('input')
		input.required = true
		input.maxLength = 20
		const divInput = contentTemplateClone.querySelector('form')

		const contentDiv = contentTemplateClone.querySelector('.content')

		contentDiv.id = `ID_${news._id}`
		const paragraphEmoji = contentTemplateClone.querySelector('.paragraphEmoji')

		inputButton.addEventListener('click', postComment)
		divInput.addEventListener('submit', (event) => {
			event.preventDefault()
			return false
		})
		contentDiv.addEventListener('dblclick', showCommentsBackground, true)
		contentDiv.addEventListener('dblclick', getComments, true)

		emojiArr.forEach((emojiInfo, index) =>
			paragraphEmoji.appendChild(createEmojiFromTemplate(news._id, index)),
		)
		container.appendChild(contentTemplateClone)
	})
}
