'use strict'
class TechBaseNav extends HTMLElement {
	constructor() {
		super()
		this.shadow = this.attachShadow({ mode: 'open' })
	}

	connectedCallback() {
		this.render()
	}

	async render() {
		this.shadow.innerHTML = `
			<link rel="stylesheet" type="text/css" href="../css/components/nav.css" />
				<div id="nav"><h1 id="logo">
					<a href="./">
						<img src="https://s3-ap-northeast-1.amazonaws.com/white-100.online/TechBase/assets/trail-sign-outline.svg"
							alt="" class="icon" />
						TECHBASE
					</a>
				</h1>

				<div id="topNavBar">
					<a href="/index.html" class="navButton analysisTotal">
						<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-graph-up" fill="currentColor"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z" />
							<path fill-rule="evenodd"
								d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" />
							<path fill-rule="evenodd"
								d="M10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4h-3.5a.5.5 0 0 1-.5-.5z" />
						</svg>
					</a>

					<a href="/timeline.html" class="navButton newsTimeline">
						<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-calendar2-week-fill"
							fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd"
								d="M14 2H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z" />
							<path fill-rule="evenodd"
								d="M3.5 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5V1a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5z" />
							<path
								d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
						</svg>
					</a>

					<a class="navButton profilePage" href="/profile.html">
						<svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi bi-person-lines-fill"
							fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd"
								d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7 1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm2 9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
						</svg>
					</a>
				</div></div>
		`
	}
}

customElements.define('tech-nav', TechBaseNav)
