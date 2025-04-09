import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { hashPassword, comparePassword } from '@/lib/hash'
import { signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	await connectDB()

	const { email, password } = req.body
	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password required' })
	}

	let user = await User.findOne({ email })

	if (user) {
		const isMatch = await comparePassword(password, user.password)
		if (!isMatch) {
			return res.status(401).json({ error: 'Wrong password' })
		}
	} else {
		const hashed = await hashPassword(password)
		user = await User.create({
			email,
			password: hashed,
			workflowCount: 0
		})
	}

	const token = signToken(user._id.toString())
	res.status(200).json({ token })
}
