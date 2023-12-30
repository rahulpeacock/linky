import { z } from 'zod';

const processEnvSchema = z.object({
	// Server
	SITE_URL: z.string(),

	// Client
	NEXT_PUBLIC_SITE_URL: z.string(),

	// Drizzle
	DATABASE_URL: z.string(),

	// Next Auth
	NEXTAUTH_SECRET: z.string(),
	NEXTAUTH_URL: z.string(),

	// Next Auth Providers
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GITHUB_ID: z.string(),
	GITHUB_SECRET: z.string(),
});
processEnvSchema.parse(process.env);

// global
declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof processEnvSchema> {}
	}
}
