import { nanoid } from '@/lib/utils/generate-nanoid';
import { urls } from '@/server/db/schema/urls';
import { getBaseUrl } from '@/server/trpc/shared';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const urlRouter = createTRPCRouter({
	createUrl: protectedProcedure
		.input(
			z.object({
				redirectUrl: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const { redirectUrl } = input;
				const shortenUrl = nanoid();
				const { id } = ctx.session.user;

				const url = await ctx.db
					.insert(urls)
					.values({
						title: 'Your url',
						userId: id,
						redirectUrl,
						shortenUrl,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					})
					.returning();

				return { ...url[0], baseShortenUrl: `${getBaseUrl()}/x/${url[0]?.shortenUrl}` };
			} catch (err) {
				throw new Error(input.redirectUrl);
			}
		}),
	updateUrl: protectedProcedure
		.input(
			z.object({
				payload: z.object({ title: z.string(), shortenUrl: z.string(), redirectUrl: z.string() }).partial(),
				shortenUrl: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { payload, shortenUrl } = input;
			try {
				// check if the shortenUrl in payload is present in the db
				if (payload.shortenUrl) {
					const res = await ctx.db.select({ shortenUrl: urls.shortenUrl }).from(urls).where(eq(urls.shortenUrl, payload.shortenUrl));

					if (res.length !== 0) return { success: false, message: 'Short URL already exists!' };
				}

				// when title, redirectUrl are to be updated
				const url = await ctx.db
					.update(urls)
					.set({ ...payload })
					.where(eq(urls.shortenUrl, shortenUrl))
					.returning({ title: urls.title, shortenUrl: urls.shortenUrl, redirectUrl: urls.redirectUrl });

				return {
					success: true,
					url,
					baseShortenUrl: `${getBaseUrl()}/x/${url[0]?.shortenUrl}`,
				};
			} catch (err) {
				throw new Error(`${getBaseUrl()}/x/${shortenUrl}`);
			}
		}),
	deleteUrl: protectedProcedure
		.input(
			z.object({
				shortenUrl: z.string(),
				title: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const { shortenUrl, title } = input;
			try {
				const url = await ctx.db.delete(urls).where(eq(urls.shortenUrl, shortenUrl)).returning();
				return {
					success: true,
					url,
					baseShortenUrl: `${getBaseUrl()}/x/${shortenUrl}`,
				};
			} catch (err) {
				throw new Error(title);
			}
		}),
});
