'use strict'
import config from './infra/config.js'
import { publicApi } from './infra/apis.js'

const timeline = document.querySelector('.timeline')
const timelineTitle = document.querySelector('.timelineTitle')
let search = document.querySelector('#search')

const url = new URL(window.location)
const urlParams = new URLSearchParams(url.search)

let sort = ''
let page = 1
let scrollStatus = false
let defaultEndDay = new Date()

$(window).scroll(async function () {
	const startTime = urlParams.get('startTime') || '2007-07-07'
	const endTime = document.querySelector('.endTime').value || defaultEndDay
	const searchBar = document.querySelector('.timelineTitle')

	const IsScrollToBottom =
		$(window).scrollTop() + $(window).height() >= $(document).height() &&
		scrollStatus
	if (IsScrollToBottom) {
		document.querySelectorAll('.loaded').forEach((element) => {
			element.classList.remove('loaded')
			element.classList.add('loading')
		})
		if (!page) page = 1
		console.log('searchBar.value', searchBar.value)
		if (searchBar.value !== 'NEWS TIMELINE ') {
			sort = searchBar.value.slice(1)
		}

		if (!window.location.href.split('?')[1] || !urlParams.get('search')) {
			page++
			const nextPage = await getNewsByTag(sort, page, startTime, endTime)
			!nextPage ? (scrollStatus = false) : (scrollStatus = scrollStatus)
			scrollStatus = false
				? $('.loading').removeClass('loading').addClass('end')
				: scrollStatus
		} else {
			page++
			const nextPage = await getNewsByKeywords(sort, page)
			!nextPage ? (scrollStatus = false) : (scrollStatus = true)
			scrollStatus = false
				? $('.loading').removeClass('loading').addClass('end')
				: scrollStatus
		}
	}
})

if (urlParams.get('search') && urlParams.get('search') !== '') {
	search = urlParams.get('search')
	page = 1
	timelineTitle.placeholder = urlParams.get('search')
	timelineTitle.value = urlParams.get('search')
	getNewsByKeywords(search, page)
} else if (urlParams.get('sort')) {
	page = urlParams.get('page')
	sort = urlParams.get('sort')
	timelineTitle.placeholder = sort
	timelineTitle.value = '#' + sort
	getNewsByTag(sort, page)
} else {
	page = 1
	timelineTitle.placeholder = 'NEWS TIMELINE '
	timelineTitle.value = 'NEWS TIMELINE '
	getNewsByTag(sort, page)
}

async function getNewsByKeywords(search, page) {
	const startTime = urlParams.get('startTime') || '2007-07-07'
	const endTime = urlParams.get('endTime')
	if (search[0] == '#') search = search.substr(1)
	if (timelineTitle.value == 'NEWS TIMELINE ') search = ''

	let requestUrl =
		config.api.news.search +
		`?search=${search}` +
		`&page=${page}` +
		`&startTime=${startTime}`

	if (endTime) requestUrl += `&endTime=${endTime}`

	const { data } = (
		await publicApi({
			url: requestUrl,
			method: 'GET',
		})
	).data

	if (!data.news.length || data.news.length < 6) {
		$('.loading').removeClass('loading').addClass('end')
		scrollStatus = false
	} else {
		scrollStatus = true
	}
	await createTimeLine(data)
	return data.nextPage
}

async function getNewsByTag(tag, page) {
	const startTime = urlParams.get('startTime') || '2007-07-07'
	const endTime = urlParams.get('endTime')
	if (tag[0] == '#') tag.shift()
	let requestUrl =
		config.api.news.timeline +
		'?sort=' +
		tag +
		`&page=${page}` +
		`&startTime=${startTime}`

	if (endTime) requestUrl += `&endTime=${endTime}`

	const { data } = (
		await publicApi({
			url: requestUrl,
			method: 'GET',
		})
	).data

	if (data.news.length > 0) {
		if (data.news.length < 6) {
			$('.loading').removeClass('loading').addClass('end')
			scrollStatus = false
		} else {
			scrollStatus = true
		}
		await createTimeLine(data)
	} else {
		$('.loading').removeClass('loading').addClass('end')
		scrollStatus = false
	}

	return data.nextPage
}

async function createTimeLine(data) {
	if (!data.news.length) return
	let direction = '-l'
	await data.news.forEach((news) => {
		const temp = document.getElementsByTagName('template')[0]
		const newsTemplateClone = temp.content.cloneNode(true)
		newsTemplateClone.querySelector('.time').innerText = news.date.slice(0, 10)
		const directionFlag = newsTemplateClone.querySelector('.direction')
		const title = newsTemplateClone.querySelector('.flag')
		title.innerText = news.title
		title.addEventListener('click', function () {
			document.location.href =
				'./newsDetails.html' + '?title=' + encodeURIComponent(news.title)
		})
		newsTemplateClone.querySelector('.desc').innerText =
			news.content.find(
				(paragraph) =>
					paragraph.content[0] !== '<' &&
					paragraph.content.split(' ')[0] !== 'By',
			).content + '...'
		const spanTags = newsTemplateClone.querySelector('.tags')

		news.tags.slice(0, 5).forEach((tag) => {
			const timeSpan = document.createElement('span')
			timeSpan.innerText = '#' + tag.tags + ' '
			timeSpan.className = 'tag'
			timeSpan.addEventListener('click', function () {
				const endTime =
					document.querySelector('.endTime').value || defaultEndDay
				const startTime =
					document.querySelector('.startTime').value || '2007-07-07'
				document.location.href =
					'./timeline.html' +
					'?sort=' +
					tag.tags +
					'&page=' +
					1 +
					`&startTime=${startTime}&endTime=${endTime}`
				timelineTitle.placeholder = '#' + tag.tags
				timelineTitle.value = '#' + tag.tags
			})
			spanTags.appendChild(timeSpan)
		})

		timeline.appendChild(newsTemplateClone)

		if (direction === '-r') {
			directionFlag.className = 'direction-l'
			direction = '-l'
		} else {
			directionFlag.className = 'direction-r'
			direction = '-r'
		}
	})
}
