'use strict'
const baseUrl = 'https://techbase.white-100.online/'
// const baseUrl = 'http://localhost:7000/'
const publicApi = axios.create({
	baseURL: baseUrl,
	headers: { 'Content-Type': 'application/json' },
})

const privateApi = axios.create({
	baseURL: baseUrl,
	headers: { 'Content-Type': 'application/json' },
})

privateApi.interceptors.request.use(
	(config) => {
		const { access_token } = JSON.parse(localStorage.getItem('techBase'))

		if (!access_token) {
			window.location('/index.html')
		}
		config.headers.Authorization = `${access_token}`
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

publicApi.interceptors.response.use(
	(resp) => {
		return resp
	},
	(error) => {
		console.log(error)
		const errResponse = error.response || {}
		const { status, data } = errResponse
		const { type } = data.error

		if (status === 403) localStorage.removeItem('techBase')

		switch (type) {
			case 'FORBIDDEN':
			case 'USER_NOT_FOUND':
				alert('Invalid Password or Email...')
				console.log(errResponse)
				break
			case 'AUTH_NO_TOKEN':
			case 'AUTH_NO_IDENTITY':
			case 'USER_INVALID_TOKEN':
				console.log(errResponse)
				localStorage.removeItem('techBase')
				alert('Please Log In...')
				break
			default:
				console.log(error)
				break
		}

		return Promise.reject(error)
	},
)

privateApi.interceptors.response.use(
	(resp) => {
		return resp
	},
	(error) => {
		const errResponse = error.response || {}
		const { status, data } = errResponse
		const { type } = data.error

		if (status === 403) {
			localStorage.removeItem('techBase')
		}

		switch (type) {
			case 'FORBIDDEN':
			case 'USER_NOT_FOUND':
				alert('Invalid Password or Email...')
				localStorage.removeItem('techBase')
				window.location.reload()
				break
			case 'USER_INVALID_TOKEN':
				console.log(errResponse)
				localStorage.removeItem('techBase')
				alert('Please Log In...')
				break
			default:
				console.log(error)
				break
		}

		return Promise.reject(error)
	},
)

export { publicApi, privateApi }
