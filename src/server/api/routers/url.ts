import { nanoid } from '@/lib/utils/generate-nanoid';
import { urls } from '@/server/db/schema/urls';
import { getBaseUrl } from '@/server/trpc/shared';
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

				const res = await ctx.db
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

				return { ...res[0], baseShortenUrl: `${getBaseUrl()}/x/${res[0]?.shortenUrl}` };
			} catch (err) {
				throw new Error(input.redirectUrl);
			}
		}),
});
