import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import HeroAuth from '@/components/pages/home';
import { Skeleton } from '@/components/ui/skeleton';
import { Metadata } from 'next';
import { Fragment, Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Linky - Home',
};

export default async function page() {
	return (
		<Fragment>
			<Header />
			<main className='min-h-hvh'>
				<section className='flex items-start justify-center py-14'>
					<div className='max-w-maxi'>
						<h2 className='text-center text-3xl sm:text-4xl md:text-6xl font-semibold'>Shorten your long links :{')'}</h2>
						<p className='max-w-lg md:max-w-xl w-11/12 mx-auto mt-4 text-center text-sm text-muted-foreground'>
							Linkly is an efficient and easy-to-use URL shortening service that streamlines your online experience.
						</p>
						<div className='text-center pt-4 md:pt-5'>
							<Suspense fallback={<Skeleton className='h-9 w-36' />}>
								<HeroAuth />
							</Suspense>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</Fragment>
	);
}
