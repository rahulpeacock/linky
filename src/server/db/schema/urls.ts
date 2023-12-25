// Present: id, title, redirectUrl, shortenUrl, clicks, status
// Future: lastVisit

import { bigint, boolean, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from '.';

export const urls = pgTable(
	'urls',
	{
		id: serial('id'),
		userId: varchar('user_id', { length: 255 }).notNull(),
		title: varchar('title', { length: 255 }).notNull(),
		redirectUrl: varchar('redirect_url', { length: 255 }).notNull(),
		shortenUrl: varchar('shorten_url', { length: 255 }).notNull().primaryKey(),
		clicks: bigint('clicks', { mode: 'number' }).default(0).notNull(),
		status: boolean('status').default(true).notNull(),
		createdAt: timestamp('created-at', { mode: 'string' }).notNull(),
		updatedAt: timestamp('updated-at', { mode: 'string' }).notNull(),
		lastVisit: timestamp('last_visit', { mode: 'date' }),
	},
	(table) => {
		return {
			shortenUrl: uniqueIndex('shorten_url').on(table.shortenUrl),
		};
	},
);
export type Urls = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;
