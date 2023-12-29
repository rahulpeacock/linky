import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import HeroAuth from '@/components/pages/home';
import { Fragment, Suspense } from 'react';

export default async function page() {
	return (
		<Fragment>
			<Header />
			<main>
				<section className='flex items-start justify-center py-14'>
					<div className='max-w-maxi'>
						<h2 className='text-center text-6xl font-semibold'>Shorten your long links :{')'}</h2>
						<p className='max-w-xl mx-auto mt-4 text-center text-sm text-muted-foreground'>
							Linkly is an efficient and easy-to-use URL shortening service that streamlines your online experience.
						</p>
						<div className='text-center pt-5'>
							<Suspense fallback={<div>loading...</div>}>
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
