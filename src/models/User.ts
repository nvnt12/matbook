// models/User.ts
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: String,
		workflowCount: { type: Number, default: 0 }
	},
	{ timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
