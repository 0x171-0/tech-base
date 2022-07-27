'use strict'
let that
class Tab {
	constructor() {
		that = this
		this.tabBox = document.querySelector('.tabsBox')
		this.tabs = this.tabBox.querySelectorAll('.tab')
		this.tabContentSections = this.tabBox.querySelectorAll('.tabContain')
		this.init()
	}

	init() {
		for (let i = 0; i < this.tabs.length; i++) {
			this.tabs[i].index = i
			this.tabs[i].onclick = this.toggleTab
		}
	}

	toggleTab() {
		that.tabs.forEach((item) => (item.id = ''))
		that.tabContentSections.forEach((item) => (item.id = ''))
		this.id = 'activeTab'
		that.tabContentSections[this.index].id = 'activeTabContainer'
	}
}

export default Tab
