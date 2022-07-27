'use strict'
export const createDailyLineChart = ({ data, tagsName }) => {
	const chart = anychart.line()
	chart.padding([10, 20, 30, 20])
	chart.animation(true)
	chart.crosshair(true)
	chart.title('Top 5 tags / Day')
	chart.yAxis().title('times')

	const dataSet = anychart.data.set(data)
	const firstSeriesData = dataSet.mapAs({
		x: 0,
		value: 1,
	})
	const secondSeriesData = dataSet.mapAs({
		x: 0,
		value: 2,
	})
	const thirdSeriesData = dataSet.mapAs({
		x: 0,
		value: 3,
	})
	const forthSeriesData = dataSet.mapAs({
		x: 0,
		value: 4,
	})
	const fifthSeriesData = dataSet.mapAs({
		x: 0,
		value: 5,
	})

	// temp variable to store series instance
	let series
	series = chart.line(firstSeriesData)
	series.name(tagsName[0].tags)
	// enable series data labels
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	// enable series markers
	series.markers(true)
	series = chart.line(secondSeriesData)
	series.name(tagsName[1].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	series.markers(true)
	series = chart.line(thirdSeriesData)
	series.name(tagsName[2].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	series.markers(true)
	series = chart.line(forthSeriesData)
	series.name(tagsName[3].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	series.markers(true)
	series = chart.line(fifthSeriesData)
	series.name(tagsName[4].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	series.markers(true)
	chart.contextMenu(false)
	// turn the legend on
	chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0])
	chart.container('lineChartByday')
	chart.draw()
}

export const createWeeklyLineChart = ({ data, tagsName }) => {
	const chart = anychart.line()
	chart.padding([10, 20, 30, 20])
	chart.animation(true)
	chart.crosshair(true)
	chart.title('Top 5 tags / Week')
	chart.yAxis().title('times')

	const dataSet = anychart.data.set(data)
	const firstSeriesData = dataSet.mapAs({
		x: 0,
		value: 1,
	})
	const secondSeriesData = dataSet.mapAs({
		x: 0,
		value: 2,
	})
	const thirdSeriesData = dataSet.mapAs({
		x: 0,
		value: 3,
	})
	const forthSeriesData = dataSet.mapAs({
		x: 0,
		value: 4,
	})
	const fifthSeriesData = dataSet.mapAs({
		x: 0,
		value: 5,
	})
	// temp variable to store series instance
	let series
	series = chart.line(firstSeriesData)
	series.name(tagsName[0].tags)
	// enable series data labels
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	// enable series markers
	series.markers(true)
	series = chart.line(secondSeriesData)
	series.name(tagsName[1].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	series.markers(true)
	series = chart.line(thirdSeriesData)
	series.name(tagsName[2].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	series.markers(true)
	series = chart.line(forthSeriesData)
	series.name(tagsName[3].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	series.markers(true)
	series = chart.line(fifthSeriesData)
	series.name(tagsName[4].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	series.markers(true)
	chart.contextMenu(false)
	// turn the legend on
	chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0])
	chart.container('lineChartByWeek')
	chart.draw()
}

export const createMonthlyLineChart = ({ data, tagsName }) => {
	const chart = anychart.line()
	chart.padding([10, 20, 30, 20])
	chart.animation(true)
	chart.crosshair(true)
	chart.title('Top 5 tags / Month')
	chart.yAxis().title('times')

	const dataSet = anychart.data.set(data)
	const dataM1 = dataSet.mapAs({
		x: 0,
		value: 1,
	})
	const dataM2 = dataSet.mapAs({
		x: 0,
		value: 2,
	})
	const dataM3 = dataSet.mapAs({
		x: 0,
		value: 3,
	})
	const dataM4 = dataSet.mapAs({
		x: 0,
		value: 4,
	})
	const dataM5 = dataSet.mapAs({
		x: 0,
		value: 5,
	})
	// temp variable to store series instance
	let series
	series = chart.line(dataM1)
	series.name(tagsName[0].tags)
	// enable series data labels
	series.labels().enabled(true).anchor('left-bottom').padding(2)
	// enable series markers
	series.markers(true)
	series = chart.line(dataM2)
	series.name(tagsName[1].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)

	series.markers(true)
	series = chart.line(dataM3)
	series.name(tagsName[2].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)

	series.markers(true)
	series = chart.line(dataM4)
	series.name(tagsName[3].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)

	series.markers(true)
	series = chart.line(dataM5)
	series.name(tagsName[4].tags)
	series.labels().enabled(true).anchor('left-bottom').padding(2)

	series.markers(true)
	// turn the legend on
	chart.contextMenu(false)
	chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0])
	chart.container('lineChartByMonth')
	chart.draw()
}
