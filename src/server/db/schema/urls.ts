// Present: id, title, redirectUrl, shortenUrl, clicks, status
// Future: lastVisit

import { bigint, boolean, date, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from '.';

export const urls = pgTable(
	'urls',
	{
		id: serial('id'),
		title: varchar('title', { length: 256 }),
		redirectUrl: varchar('redirect_url', { length: 256 }),
		shortenUrl: varchar('shorten_url', { length: 256 }).primaryKey(),
		clicks: bigint('clicks', { mode: 'number' }),
		status: boolean('status').default(true),
		lastVisit: date('last_visit', { mode: 'date' }),
	},
	(table) => {
		return {
			shortenUrlIdx: uniqueIndex('shorten_url_idx').on(table.shortenUrl),
		};
	},
);
