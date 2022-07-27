'use strict'
import config from '../infra/config.js'
import { createTextCloud } from '../chart/textCloudChart.js'
import { publicApi } from '../infra/apis.js'

import {
	createDailyLineChart,
	createWeeklyLineChart,
	createMonthlyLineChart,
} from '../chart/lineChart.js'

export async function createNewsAnalyticsReport({
	positive,
	negative,
	terms,
	behaviors,
	comparative,
	calculation,
	tags,
	date,
}) {
	createTextCloud('positive', 'blue', positive, 20)
	createTextCloud('negative', 'red', negative, 20)
	createTextCloud('terms', 'rgb(38,169,87)', terms, 26)
	createTextCloud('behaviors', 'rgb(38,169,87)', behaviors, 26)

	createPositiveNegativeBar(comparative, calculation)

	await fetchAndRenderLineChart({
		topTags: tags.slice(0, 5),
		topTagsArr: tags.slice(0, 5).map((e) => e.tags),
		date,
	})
}

async function fetchAndRenderLineChart({ topTags, topTagsArr, date }) {
	const { data: dayLineChartData } = (
		await publicApi({
			method: 'GET',
			url:
				config.api.news.analyzeLineChart +
				'/day' +
				'?tags=' +
				`${topTagsArr}` +
				'&date=' +
				`${date}`,
		})
	).data

	const { data: weekLineChartData } = (
		await publicApi({
			method: 'GET',
			url:
				config.api.news.analyzeLineChart +
				'/week' +
				'?tags=' +
				`${topTagsArr}` +
				'&date=' +
				`${date}`,
		})
	).data

	const { data: monthLineChartData } = (
		await publicApi({
			method: 'GET',
			url:
				config.api.news.analyzeLineChart +
				'/month' +
				'?tags=' +
				`${topTagsArr}` +
				'&date=' +
				`${date}`,
		})
	).data

	createDailyLineChart({ data: dayLineChartData, tagsName: topTags })
	createWeeklyLineChart({ data: weekLineChartData, tagsName: topTags })
	createMonthlyLineChart({ data: monthLineChartData, tagsName: topTags })
}

async function createPositiveNegativeBar(comparative, calculation) {
	let scorePortion = 0
	if (comparative > 0) {
		scorePortion = (comparative + 5) / 10
	} else if (comparative < 0) {
		scorePortion = Math.abs(-5 - comparative) / 10
	} else if (comparative == 0) {
		scorePortion = 0.5
	}
	const portion = calculation[0] / (calculation[0] + Math.abs(calculation[1]))

	// Draw bar
	const scoreBenchmark = document.querySelector('.compareContainer').clientWidth
	const barScore = portion
	const scoreDivCon = document.querySelector('.compareScore')
	scoreDivCon.setAttribute('style', `width:${barScore * scoreBenchmark}px`)

	document.querySelector('.mainEmoji').innerHTML = emojiCalculator()
}

function emojiCalculator(portion) {
	const mainEmoji = {
		0: '&#x1F631;',
		1: '&#x1F630;',
		2: '&#x1F628;',
		3: '&#x1F615;',
		4: '&#x1F610;',
		5: '&#x1F60A;',
		6: '&#x1F604;',
		7: '&#x1F602;',
		8: '&#x1F923;',
	}
	return mainEmoji[Math.floor(Number(portion * 10))] || mainEmoji[8]
}
