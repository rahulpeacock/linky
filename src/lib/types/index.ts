import { z } from 'zod';

const processEnvSchema = z.object({
	// Auth
	NEXTAUTH_URL: z.string(),
	NEXTAUTH_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GITHUB_ID: z.string(),
	GITHUB_SECRET: z.string(),

	// server
	DATABASE_URL: z.string(),
});
processEnvSchema.parse(process.env);

// global
declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof processEnvSchema> {}
	}
}
