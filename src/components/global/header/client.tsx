'use client';

import CircularLoader from '@/components/global/loading/circular-loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { genetateUserName } from '@/lib/utils/generate-username';
import { LogIn, LogOut, UserRound } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';

export function HeaderAuth() {
	const { data: session, status } = useSession();

	if (status === 'authenticated' && session) {
		return <UserProfile session={session} />;
	}

	return (
		<Button asChild className='px-5 text-sm'>
			<Link href={'/auth/signin'}>
				Sign in <LogIn size={16} className='ml-2' strokeWidth={2.5} />
			</Link>
		</Button>
	);
}

function UserProfile({ session }: { session: Session }) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSignout() {
		setLoading(true);
		await signOut();
		setLoading(false);
		router.replace('/');
	}

	return (
		<div className='flex items-center justify-center'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type='button'
						className='ring-primary/50 data-[state=closed]:ring-0 data-[state=open]:ring-4 duration-200 rounded-full focus:outline-0 border-primary-foreground border'
					>
						<Avatar className='scale-100 shadow-lg'>
							<AvatarImage src={session.user.image as string} alt='profile-pic' />
							<AvatarFallback>{genetateUserName(session.user.name ? (session.user.name as string) : (session.user.email as string))}</AvatarFallback>
						</Avatar>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-96 rounded-[1rem] shadow-spread pb-0' variant='space' align='end' sideOffset={12}>
					<DropdownMenuLabel className='font-normal px-6 py-0 mb-2'>
						<div className='flex justify-start items-center gap-4'>
							<div className='w-11 aspect-square'>
								<Image
									src={session.user.image as string}
									className='rounded-full'
									alt='profile-pic'
									width={100}
									height={100}
									unoptimized
									loading='lazy'
								/>
							</div>
							<div>
								<p className='font-medium text-sm'>{session.user.name}</p>
								<p className='text-muted-foreground text-[13px]'>{session.user.email}</p>
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuGroup>
						<NavAuthLinks />
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
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

const AUTHORIZED_ROUTES = [
	{
		id: 1,
		label: 'Your Profile',
		href: '/profile',
		icon: UserRound,
	},
] as const;

function NavAuthLinks() {
	const { data: session } = useSession();

	return (
		<Fragment>
			{session?.user && (
				<Fragment>
					{AUTHORIZED_ROUTES.map((link) => (
						<DropdownMenuItem key={link.id} className='px-6 py-3.5 rounded-none group font-medium' asChild>
							<Link href={link.href} className='text-muted-foreground hover:cursor-pointer flex justify-start items-center gap-4'>
								<span className='flex items-stretch justify-center basis-11'>
									{<link.icon className='duration-100 group-hover:text-foreground' size={16} strokeWidth={2.25} />}
								</span>
								<span>{link.label}</span>
							</Link>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
				</Fragment>
			)}
		</Fragment>
	);
}
