import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export const signToken = (userId: string) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
