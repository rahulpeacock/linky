import { TITLE } from '@/constants/app';
import { nanoid } from '@/lib/utils/generate-nanoid';
import { getServerBaseUrl } from '@/lib/utils/get-base-url';
import { urls } from '@/server/db/schema/urls';
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
						title: TITLE,
						userId: id,
						redirectUrl,
						shortenUrl,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					})
					.returning();

				return { ...url[0], baseShortenUrl: `${getServerBaseUrl()}/x/${url[0]?.shortenUrl}` };
			} catch (err) {
				throw new Error(input.redirectUrl);
			}
		}),
	updateUrl: protectedProcedure
		.input(
			z.object({
				payload: z.object({ title: z.string(), shortenUrl: z.string(), redirectUrl: z.string() }).partial(),
				title: z.string(),
				shortenUrl: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const { payload, shortenUrl } = input;

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
					baseShortenUrl: `${getServerBaseUrl()}/x/${url[0]?.shortenUrl}`,
				};
			} catch (err) {
				throw new Error(input.title);
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
			try {
				const { shortenUrl } = input;
				const url = await ctx.db.delete(urls).where(eq(urls.shortenUrl, shortenUrl)).returning();
				return {
					success: true,
					url,
					baseShortenUrl: `${getServerBaseUrl()}/x/${shortenUrl}`,
				};
			} catch (err) {
				throw new Error(input.title);
			}
		}),
});
