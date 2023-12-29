'use client';

import CircularLoader from '@/components/global/loading/circular-loader';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SignoutButton() {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSignout() {
		setLoading(true);
		await signOut();
		setLoading(false);
		router.replace('/');
	}

	return (
		<DropdownMenuItem
			className='focus:bg-destructive w-full hover:cursor-pointer px-6 py-3.5 rounded-none group font-medium'
			onClick={(e) => e.preventDefault()}
			asChild
		>
			<button type='button' className='gap-4 text-muted-foreground group' onClick={handleSignout} disabled={loading}>
				<span className='flex items-stretch justify-center basis-11'>
					{loading ? (
						<CircularLoader className='h-5' />
					) : (
						<LogOut className='duration-100 group-hover:text-foreground' size={16} strokeWidth={2.25} />
					)}
				</span>
				<span>Sign out</span>
			</button>
		</DropdownMenuItem>
	);
}
