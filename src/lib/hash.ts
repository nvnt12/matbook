import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string) => bcrypt.hash(password, 10)
export const comparePassword = async (input: string, hash: string) => bcrypt.compare(input, hash)
