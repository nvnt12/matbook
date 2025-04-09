export function getUserIdFromToken() {
	if (typeof window === 'undefined') {
		return null
	}

	const token = localStorage.getItem('token')
	if (!token) return null

	try {
		const payloadBase64 = token.split('.')[1]
		const decodedPayload = JSON.parse(atob(payloadBase64))
		return decodedPayload.userId
	} catch (err) {
		console.error('Error decoding token', err)
		return null
	}
}
