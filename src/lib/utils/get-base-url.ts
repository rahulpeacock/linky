export function getClientBaseUrl() {
	return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_VERCEL_URL;
}
