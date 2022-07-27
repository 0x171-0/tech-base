'use strict'
export const createTextCloud = (type, color, dataWords, fontsize) => {
	// set the dimensions and margins of the graph
	const margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	}
	const width = 300 - margin.left - margin.right
	const height = 200 - margin.top - margin.bottom
	// append the svg object to the body of the page
	const svg = d3
		.select(`#${type}`)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	const layout = d3.layout
		.cloud()
		.size([width, height])
		.words(
			dataWords.map(function (d) {
				return {
					text: d.word,
					size: d.size,
				}
			}),
		)
		.padding(8) // space between words
		.rotate(function () {
			return 0
		})
		.fontSize(function (d) {
			return d.size + fontsize
		}) // font size of words
		.on('end', draw)

	layout.start()

	/**
	 * @param {number} words
	 */
	function draw(words) {
		svg
			.append('g')
			.attr(
				'transform',
				'translate(' + layout.size()[0] / 2 + ',' + layout.size()[1] / 2 + ')',
			)
			.selectAll('text')
			.data(words)
			.enter()
			.append('text')
			.style('font-size', function (d) {
				return d.size
			})
			.style('fill', color)
			.attr('text-anchor', 'middle')
			// .style('font-family', 'Impact')
			.attr('transform', function (d) {
				return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
			})
			.text(function (d) {
				return d.text
			})
	} // This function takes the output of 'layout' above and draw the words
	// Wordcloud features that are THE SAME from one word to the other can be here
}
