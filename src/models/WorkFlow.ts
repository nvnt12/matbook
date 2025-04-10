import mongoose from 'mongoose'

const nodeSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['api', 'email', 'text'],
			required: true
		},
		data: {
			type: Object,
			required: true
		}
	},
	{ _id: false }
)

const statusHistorySchema = new mongoose.Schema(
	{
		status: {
			type: String,
			enum: ['passed', 'failed'],
			required: true
		},
		timestamp: {
			type: Date,
			default: Date.now
		}
	},
	{ _id: false }
)

const workflowSchema = new mongoose.Schema(
	{
		workflowId: { type: String, required: true },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		name: { type: String, required: true },
		description: { type: String },
		author: {
			firstName: { type: String },
			lastName: { type: String }
		},
		nodes: {
			type: [nodeSchema],
			default: []
		},
		status: {
			type: String,
			enum: ['passed', 'failed']
		},
		statusHistory: {
			type: [statusHistorySchema],
			default: []
		}
	},
	{ timestamps: true }
)

export const Workflow = mongoose.models.Workflow || mongoose.model('Workflow', workflowSchema)
