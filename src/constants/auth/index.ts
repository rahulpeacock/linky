import { type PagesOptions } from 'next-auth';

export const AUTH_PAGES = {
	signIn: '/auth/signin',
} satisfies Partial<PagesOptions>;
