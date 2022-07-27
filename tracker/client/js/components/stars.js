'use strict'
class TechBaseStars extends HTMLElement {
	constructor() {
		super()
		this.shadow = this.attachShadow({ mode: 'open' })
	}

	connectedCallback() {
		this.render()
	}

	async render() {
		this.shadow.innerHTML = `
<link rel="stylesheet" type="text/css" href="../css/components/star.css" />
		<div>
				<div class="starsec"></div>
				<div class="starthird"></div>
				<div class="starfourth"></div>
				<div class="starfifth"></div>
			</div>
		`
	}
}

customElements.define('scattered-stars', TechBaseStars)
