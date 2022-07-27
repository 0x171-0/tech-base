'use strict'
if (window.location.pathname === '/timeline.html') {
	window.addEventListener('load', function (event) {
		setTimeout(function () {
			document.querySelectorAll('.loading').forEach((element) => {
				element.classList.remove('loading')
				element.classList.add('loaded')
			})
		}, 1000)
	})
} else {
	window.addEventListener('load', function (event) {
		setTimeout(function () {
			document.querySelectorAll('.loadContent').forEach((element) => {
				element.classList.remove('chartLoading')
				element.classList.add('loaded')
			})
		}, 1000)
	})
}
