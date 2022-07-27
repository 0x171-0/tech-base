import SocketIO from 'socket.io'
import { Socket } from 'socket.io'
import CommentsDb from '../db/modules/user/comments'
export let io: any

export const socketIoInit = (server: any) => {
	try {
		// @ts-ignore
		io = SocketIO(server)
		console.log(`--- WebSocket Connected ---`)
		const onConnection = (socket: Socket) => {
			socket.on('heartbeat', () => {
				console.log('TackBase webSocket is connected ... ')
			})
		}

		io.on('connection', onConnection)

		io.on('connect', (socket: Socket) => {
			socket.on(
				'postNewsComment',
				({ userId, userName, contentId, comment, date, picture }) => {
					CommentsDb.saveComment(
						userId,
						userName,
						contentId,
						comment,
						date,
						picture,
					)
				},
			)
		})
	} catch (error) {
		throw error
	}
}
