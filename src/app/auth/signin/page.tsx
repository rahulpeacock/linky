import OAuthSignin from '@/components/pages/auth/oauth-signin';
import { Metadata } from 'next';
import { getProviders } from 'next-auth/react';

export const metadata: Metadata = {
	title: 'Linky - Signin',
};

export default async function Page() {
	const providers = (await getProviders()) ?? [];

	return (
		<main>
			<section>
				<div className='max-w-maxi mx-auto flex items-center justify-center min-h-screen'>
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
	);
}
