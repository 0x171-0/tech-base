'use strict'
import config from '../infra/config.js'

anychart.onDocumentReady(function () {
	// set chart theme
	anychart.theme('darkBlue')
	$.ajax(config.api.news.allTopTags).done(function (response) {
		const { data } = response
		const chart = anychart.tagCloud(data)
		const background = chart.background()
		background.stroke('2 ')
		// background.corners( 10 );
		background.fill('#0F1D3B')
		chart.angles([0]).textSpacing(1).contextMenu(false).fontStyle('normal')
		const customColorScale = anychart.scales.ordinalColor()
		customColorScale.ranges([
			{
				less: 30,
			},
			{
				from: 30,
				to: 40,
			},
			{
				from: 40,
				to: 50,
			},
			{
				from: 50,
				to: 60,
			},
			{
				from: 60,
				to: 70,
			},
			{
				from: 70,
				to: 80,
			},
			{
				from: 80,
				to: 90,
			},
			{
				from: 90,
				to: 100,
			},
			{
				greater: 100,
			},
		])
		const state = chart.normal()
		// Set font style.
		state.fontVariant('small-caps')
		customColorScale.colors([
			'#0f0',
			'#17f741',
			'#6AE205',
			'#b3ff00',
			'yellow',
			'#00ff44',
			'#00ff84',
			'#b3ff00',
			'#54F6FE',
		])
		// chart.mode( "rect" );
		chart.colorScale(customColorScale)
		chart.tooltip(false)
		chart.hovered().fill('yellow')
		chart.selected().fill('#54F6FE')
		chart.contextMenu(false)
		chart.container('container')
		chart.draw()
		chart.listen('pointClick', function (e) {
			const url = '/timeline.html?sort=' + e.point.get('x')
			window.open(url, '_self')
		})
	})
})
