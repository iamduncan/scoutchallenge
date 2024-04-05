import * as cookie from 'cookie'

const cookieName = 'en_preferences'

export type Preferences = {
	sidebar: 'open' | 'closed'
}

export function getPreferences(request: Request): Preferences | null {
	const cookieHeader = request.headers.get('cookie')
	const parsed = cookieHeader ? cookie.parse(cookieHeader)[cookieName] : null
	if (parsed) {
		return JSON.parse(parsed) as Preferences
	}
	return null
}

export function setPreferences(preferences: Preferences) {
	return cookie.serialize(cookieName, JSON.stringify(preferences), {
		path: '/',
		maxAge: 31536000,
	})
}
