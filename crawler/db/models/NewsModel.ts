import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const Tags = new Schema({
	tags: String,
	count: Number,
})

const userSubComment = new Schema(
	{
		date: Date,
		comment: String,
		user: String,
		like: Array,
	},
	{
		strict: false,
	}
)

const userComment = new Schema(
	{
		date: Date,
		comment: String,
		user: Array,
		sub_comment: [userSubComment],
	},
	{
		strict: false,
	}
)

const Classifier = new Schema({
	label: String,
	value: Number,
})

const Sentiment = new Schema({
	word: String,
	size: Number,
})

const Emoji = new Schema(
	{
		_id: String,
		date: Date,
		emoji: Number,
		count: Number,
		user_id: String,
		user_name: String,
	},
	{
		strict: false,
	}
)

const Content = new Schema(
	{
		content: String,
		emoji: [Emoji],
		comment: [userComment],
	},
	{
		strict: false,
	}
)

const NewsModelSchema = new Schema(
	{
		publisher: String,
		date: Date,
		title: {
			type: String,
			unique: true,
			index: true,
		},
		href: {
			type: String,
			unique: true,
		},
		img: String,
		tags: [Tags],
		content: [Content],
		score: Number,
		comparative: Number,
		calculation: Array,
		positive: [Sentiment],
		negative: [Sentiment],
		portion: Number,
		terms: [Sentiment],
		behaviors: [Sentiment],
		category: [Classifier],
	},
	{
		strict: false,
	}
)

export const NewsModel = mongoose.model('news', NewsModelSchema)
