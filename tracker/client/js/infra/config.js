'use strict'
const globalVersion = '/api/' + '1.0' + '/'
const awsS3ImagesBucket =
	'https://s3-ap-northeast-1.amazonaws.com/white-100.online/TechBase'

const config = {
	api: {
		globalVersion: globalVersion,
		news: {
			allTopTags: globalVersion + 'news' + '/allTopTags',
			analyzeLineChart: globalVersion + 'news' + '/analyze/lineChart',
			comments: {
				toggleEmoji: globalVersion + 'news' + '/comment' + '/toggleEmoji',
				comment: globalVersion + 'news' + '/comment' + '/comment',
				getSumEmoji: globalVersion + 'news' + '/comment' + '/getSumEmoji',
			},
			info: globalVersion + 'news' + '/detail',
			search: globalVersion + 'news' + '/search',
			timeline: globalVersion + 'news' + '/timeline',
		},
		user: {
			profile: globalVersion + 'user' + '/profile',
			signIn: globalVersion + 'user' + '/signIn',
			signUp: globalVersion + 'user' + '/signUp',
			watchLater: globalVersion + 'user' + '/watchLater',
			folders: globalVersion + 'user' + '/folders',
			follow: globalVersion + 'user' + '/follow',
			publicProfile: globalVersion + 'user' + '/public',
			posts: globalVersion + 'user' + '/posts',
			bookmarks: globalVersion + 'user' + '/bookmarks',
			watchLater: globalVersion + 'user' + '/watchLater',
			history: globalVersion + 'user' + '/history',
			getHistory: globalVersion + 'user' + '/getHistory',
			uploadImage: globalVersion + 'user' + '/uploadImage',
		},
	},
	images: {
		users: {
			profilePictureBase: awsS3ImagesBucket + '/user/',
		},
		news: {
			comments: {
				defaultUserIcon: awsS3ImagesBucket + '/assets/alien_icon.png',
			},
		},
	},
}

export default config
