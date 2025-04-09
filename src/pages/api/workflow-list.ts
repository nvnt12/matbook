import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/db'
import { Workflow } from '@/models/WorkFlow'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		try {
			await connectDB()
			const { userId, search } = req.query

			const workflows = await Workflow.find({
				userId,
				$or: [
					{ name: { $regex: search, $options: 'i' } },
					{ workflowId: { $regex: search, $options: 'i' } }
				]
			})
			res.status(200).json(workflows)
		} catch (err) {
			res.status(500).json({ message: 'Error fetching workflows' })
			console.error(err)
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' })
	}
}
