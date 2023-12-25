import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/server/db';
import { Urls, urls } from '@/server/db/schema/urls';
import { getBaseUrl } from '@/server/trpc/shared';
import { eq } from 'drizzle-orm';
import { Copy, Settings } from 'lucide-react';
import { Session } from 'next-auth';
import Link from 'next/link';
import { Fragment } from 'react';
import { CopyLink, LinkSettings } from './client';

export default async function UserUrls({ session }: { session: Session }) {
	const userUrls = await getUrls(session.user.id);

	// when there are no user's shorten urls
	if (userUrls.length === 0) return <p className='text-center text-sm text-muted-foreground'>- No shorten urls -</p>;

	return (
		<Fragment>
			{userUrls.map((val) => (
				<UrlCard key={val.id} {...val} />
			))}
		</Fragment>
	);
}

async function getUrls(id: string) {
	const userUrls = await db.select().from(urls).where(eq(urls.userId, id));
	return userUrls;
}

function UrlCard({ title, redirectUrl, shortenUrl, clicks }: Urls) {
	const baseShortenUrl = `${getBaseUrl()}/x/${shortenUrl}`;

	return (
		<div className='p-4 rounded-lg border mb-4'>
			<div className='flex items-center justify-start'>
				<h2 className='font-medium'>{title}</h2>
				<CopyLink shortenUrl={baseShortenUrl} />
				<LinkSettings />
			</div>
			<p className='text-sm text-muted-foreground mb-3 mt-1'>{redirectUrl}</p>
			<hr />
			<div className='mt-3 flex items-center justify-between'>
				<Button className='text-sm text-muted-foreground p-0 h-auto' type='button' variant='link' asChild>
					<Link href={baseShortenUrl} target='_blank' rel='noreferrer'>
						{baseShortenUrl}
					</Link>
				</Button>
				<p className='text-xs'>
					{clicks} <span className='text-muted-foreground'>Views</span>
				</p>
			</div>
		</div>
	);
}

export function UserUrlsLoader() {
	return (
		<Fragment>
			{[1, 2, 3, 4, 5].map((val) => (
				<div key={val} className='p-4 rounded-lg border mb-4'>
					<div className='flex items-center justify-start'>
						<h2 className='font-medium w-full'>
							<Skeleton className='h-5 w-full max-w-44' />
						</h2>
						<Button className='p-1.5 h-auto w-auto ml-auto mr-1 group' variant='ghost' size='icon' disabled={true}>
							<Copy size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
						</Button>
						<Button className='p-1.5 h-auto w-auto group' variant='ghost' size='icon' disabled={true}>
							<Settings size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
						</Button>
					</div>
					<div className='text-sm text-muted-foreground mb-4 mt-1'>
						<Skeleton className='h-4 w-full max-w-96' />
					</div>
					<hr />
					<div className='mt-3 flex items-center justify-between gap-5'>
						<Skeleton className='h-4 w-full max-w-72' />
						<span className='text-sm inline-flex items-center justify-center gap-3 '>
							<Skeleton className='h-4 w-10 max-w-44' /> <span className='text-muted-foreground'>Views</span>
						</span>
					</div>
				</div>
			))}
		</Fragment>
	);
}
