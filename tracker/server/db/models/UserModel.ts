import mongoose from 'mongoose'
import { Schema, Document } from 'mongoose'

const Brose = new Schema(
	{
		_id: String,
		brose_date: Date,
		date: Date,
		publisher: String,
		title: String,
		href: String,
		content: String,
		tags: Array,
	},
	{
		strict: false,
	},
)

const UserComment = new Schema(
	{
		content_id: String,
		date: Date,
		emoji: String,
		comment: String,
		title: String,
	},
	{
		strict: false,
	},
)

const Bookmark = new Schema(
	{
		news_id: String,
		folder: String,
		publisher: String,
		date: Date,
		title: String,
		href: String,
		img: String,
		content: String,
		tags: Array,
		comment_date: Date,
		comment_title: String,
		comment: String,
	},
	{
		strict: false,
	},
)

const Followers = new Schema(
	{
		_id: String,
		name: String,
	},
	{
		strict: false,
	},
)

export interface UserInterface extends Document {
	provider?: string
	name?: string
	email?: string
	password?: string
	picture?: string
	intro?: string

	follow?: any
	notice?: any
	followers?: {
		_id: string
		name: string
	}[]

	access_token?: string
	access_expired?: Number
	login_at?: Date
	history?: any

	bookmarks?: {
		news_id: string
		folder: string
		publisher: string
		date: Date
		title: string
		href: string
		img: string
		content: string
		tags: object[]
		comment_date: Date
		comment_title: string
		comment: string
	}[]
	books_folder?: string[]
	posts?: any
	posts_folder?: string[]

	watch_later?: any
	comment?: any

	role?: string
}

export const UserModelSchema = new Schema(
	{
		name: String,
		email: String,
		password: String,
		picture: String,
		intro: String,

		follow: [Followers],
		notice: [Bookmark],
		followers: [Followers],

		access_token: String,
		access_expired: Number,
		login_at: Date,
		history: [Brose],

		bookmarks: [Bookmark],
		books_folder: Array,
		posts: [Bookmark],
		posts_folder: Array,

		watch_later: [Brose],
		comment: [UserComment],

		role: String,
	},
	{
		strict: false,
	},
)

export const UserModel = mongoose.model('user', UserModelSchema)
