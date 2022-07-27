import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const DicModelSchema = new Schema(
	{
		words: String,
	},
	{
		strict: false,
	}
)

export const DicModel = mongoose.model('dic', DicModelSchema)
