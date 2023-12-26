import { db } from '@/server/db';
import { urls } from '@/server/db/schema/urls';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';

export default async function page({ params }: { params: { shortenUrl: string } }) {
	// 1. Get the shortenUrl
	const { shortenUrl } = params;

	// 2. Get the url from the db using the shortenUrl
	const url = await db.select({ redirectUrl: urls.redirectUrl, clicks: urls.clicks }).from(urls).where(eq(urls.shortenUrl, shortenUrl));

	// 3. Check if the url is present in the db
	if (url.length === 0 || url[0] === undefined) return notFound();

	// 4. Update - clicks, lastVisit in the db for that url
	db.update(urls)
		.set({ clicks: url[0].clicks + 1, lastVisit: new Date().toISOString() })
		.where(eq(urls.shortenUrl, shortenUrl))
		.then(); // since we are not using await, .then() is used to make sure the asynchronous db update will run

	// 5. redirect the user for that url
	redirect(url[0].redirectUrl);
}
