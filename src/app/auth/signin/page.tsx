import Footer from '@/components/global/footer';
import AuthHeader from '@/components/pages/auth';
import OAuthSignin from '@/components/pages/auth/oauth-signin';
import { Metadata } from 'next';
import { getProviders } from 'next-auth/react';
import { Fragment } from 'react';

export const metadata: Metadata = {
	title: 'Signin',
};

export default async function Page() {
	const providers = (await getProviders()) ?? [];

	return (
		<Fragment>
			<AuthHeader />
			<main>
				<section className='px-5 sm:px-0'>
					<div className='max-w-maxi mx-auto flex items-start pt-24 justify-center min-h-hvh'>
						<div className='max-w-md w-full py-8 px-6 rounded-xl border shadow-spread'>
							<h2 className='text-2xl font-semibold'>Sign in</h2>
							<p className='mb-3 text-sm text-muted-foreground mt-2'>
								to continue to <span className='font-semibold'>Linky</span>
							</p>
							<div>
								<OAuthSignin providers={Object.values(providers).filter((provider) => provider.type === 'oauth')} />
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</Fragment>
	);
}
