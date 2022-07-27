'use strict'
import { getBookmark } from './reviewSystem/bookmark.js'
import { getPost } from './reviewSystem/post.js'
import { getFollow } from './follow.js'
import { getWatchLater } from './history.js'
import { getFolders } from './reviewSystem/index.js'
import { renderUserImg } from './images.js'

import Tab from '../components/tab.js'
new Tab()

export const renderProfile = () => {
	if (!localStorage.getItem('techBase')) return
	renderUserImg()
	getPost()
	getBookmark()
	getWatchLater()
	getFolders()
	getFollow()
}

renderProfile()
