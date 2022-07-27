'use strict'
import config from '../infra/config.js'
const imagesUploadForm = document.querySelector('.uploadImg')
const imgUploadBtn = document.querySelector('#uploadImg')
import { privateApi } from '../infra/apis.js'

imgUploadBtn.onchange = function () {
	const file = $('#uploadImg')[0].files[0]
	const reader = new FileReader()
	reader.onload = function (e) {
		$('.userImg').attr('src', e.target.result)
	}
	reader.readAsDataURL(file)
}

imagesUploadForm.addEventListener('change', async (e) => {
	const form = new FormData()
	const { id: userId } = JSON.parse(localStorage.getItem('techBase'))
	form.set('userId', userId)
	const randomNum = Math.floor(Math.random() * 100)
	form.set('randomNum', randomNum)
	form.append('userImage', e.target.files[0])

	const filePath = uploadImg.userImage.value.split('.')[1]
	const newFileName =
		config.images.users.profilePictureBase +
		userId +
		'_' +
		randomNum +
		'.' +
		filePath

	const { data: myJson } = (
		await privateApi({
			url: config.api.user.uploadImage,
			method: 'POST',
			data: form,
		})
	).data

	if (!myJson['error']) {
		const userInfo = JSON.parse(localStorage.getItem('techBase'))
		userInfo.picture = newFileName
		localStorage.setItem('techBase', userInfo)
		renderUserImg()
	} else {
		alert(myJson['error'])
	}
	return false
})

export const renderUserImg = () => {
	const userImgDefault = document.querySelector('.userImgDefault')
	const userNameElement = document.querySelector('.userName')
	const userIntroElement = document.querySelector('textarea')
	const { picture, name: userName, userIntro } = JSON.parse(
		localStorage.getItem('techBase'),
	)
	userNameElement.innerText = userName

	if (userIntro) userIntroElement.innerText = userIntro
	if (!picture) return
	userImgDefault.style.display = 'none'
	$('#userImg').attr('src', config.images.users.profilePictureBase + picture)
}
