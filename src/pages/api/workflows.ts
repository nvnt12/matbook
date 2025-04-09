import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { Workflow } from '@/models/WorkFlow'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectDB()

	if (req.method === 'POST') {
		try {
			const { userId, name, description, nodes, author, status } = req.body

			const user = await User.findById(userId)
			if (!user) return res.status(404).json({ message: 'User not found' })

			const count = user.workflowCount + 1
			const workflowId = String(count).padStart(3, '0')

			const newWorkflow = new Workflow({
				workflowId,
				userId,
				name,
				description,
				author,
				nodes,
				status
			})

			await newWorkflow.save()

			user.workflowCount = count
			await user.save()

			return res.status(201).json({ message: 'Workflow created', workflow: newWorkflow })
		} catch (error) {
			console.error(error)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	return res.status(405).json({ message: 'Method not allowed' })
}
