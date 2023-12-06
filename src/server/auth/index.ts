import { AUTH_PAGES } from '@/constants/auth';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import GithubProvider, { type GithubProfile } from 'next-auth/providers/github';
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			profile(profile: GoogleProfile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
				};
			},
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			profile(profile: GithubProfile) {
				return {
					id: profile.id.toString(),
					name: profile.name,
					email: profile.email,
					image: profile.avatar_url,
				};
			},
		}),
	],
	callbacks: {
		session({ session, user }) {
			if (user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	session: {
		strategy: 'jwt',
	},
	pages: AUTH_PAGES,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
