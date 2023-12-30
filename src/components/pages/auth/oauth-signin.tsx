'use client';

import { useAppSelector } from '@/client/store';
import CircularLoader from '@/components/global/loading/circular-loader';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import { ClientSafeProvider, signIn } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Fragment } from 'react';

interface OAuthSigninProps {
	providers: ClientSafeProvider[];
}

export default function OAuthSignin({ providers }: OAuthSigninProps) {
	console.log(providers);
	const { loading, id } = useAppSelector((state) => state.authSlice).signin;
	const { resolvedTheme } = useTheme();

	return (
		<Fragment>
			{providers.map((provider) => (
				<div key={provider.name}>
					<Button
						className='w-full mt-5 justify-start px-6 font-normal group'
						type='button'
						variant='outline'
						size='lg'
						disabled={loading}
						onClick={() => signIn(provider.id)}
					>
						{loading && id === provider.id ? (
							<CircularLoader className='bg-foreground mr-5 border-x-foreground border-b-foreground' />
						) : (
							<Image
								src={`/auth/${provider.id}-${resolvedTheme}-icon.svg`}
								className='w-5 h-5 mr-5'
								alt={`${provider.id}-icon`}
								width={50}
								height={50}
							/>
						)}
						<span>Continue with {provider.name}</span>
						<MoveRight
							size={16}
							strokeWidth={2.5}
							className='ml-auto text-muted-foreground invisible -translate-x-2 duration-100 scale-x-90 opacity-0 group-hover:visible group-hover:-translate-x-0 group-hover:opacity-100'
						/>
					</Button>
				</div>
			))}
		</Fragment>
	);
}
