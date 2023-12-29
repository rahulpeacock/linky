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
import { Skeleton } from '@/components/ui/skeleton';
import { AUTH_PAGES } from '@/constants/auth';
import { genetateUserName } from '@/lib/utils/generate-username';
import { getServerAuthSession } from '@/server/auth';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, Suspense } from 'react';
import { ThemeToggle } from '../theme-toggle';
import { SignoutButton } from './client';

export default function Header() {
	return (
		<header className='border-b'>
			<div className='max-w-maxi mx-auto h-16 flex items-center justify-between'>
				<div className='flex items-center justify-center'>
					<Link href={'/'} className='font-semibold'>
						Linkly
					</Link>
				</div>
				<nav className='flex items-center justify-center gap-5'>
					<ThemeToggle />
					<Suspense fallback={<Skeleton className='size-10 rounded-full' />}>
						<HeaderAuth />
					</Suspense>
				</nav>
			</div>
		</header>
	);
}

async function HeaderAuth() {
	const session = await getServerAuthSession();

	if (session) return <UserProfile session={session} />;

	return (
		<Button className='px-5 text-sm' asChild>
			<Link href={AUTH_PAGES.signIn}>
				Sign in <LogIn size={16} className='ml-2' strokeWidth={2.5} />
			</Link>
		</Button>
	);
}

const AUTHORIZED_ROUTES = [
	{
		id: 1,
		label: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
	},
] as const;

function UserProfile({ session }: { session: Session }) {
	function NavAuthLinks() {
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
						<SignoutButton />
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
