import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import UserUrls, { UserUrlsLoader } from '@/components/pages/dashboard';
import { AddUrl } from '@/components/pages/dashboard/client';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import { Fragment, Suspense } from 'react';

export default async function page() {
	const session = await getServerAuthSession();

	// for unauthenticated user
	if (!session?.user) return redirect('/');

	return (
		<Fragment>
			<Header />
			<main className='min-h-hvh'>
				<section>
					<div className='max-w-maxi mx-auto py-8'>
						<AddUrl />
					</div>
				</section>
				<section>
					<div>
						<h2 className='text-2xl font-semibold text-center'>Your links</h2>
						<div className='max-w-2xl mx-auto py-4'>
							<Suspense fallback={<UserUrlsLoader />}>
								<UserUrls session={session} />
							</Suspense>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</Fragment>
	);
}
