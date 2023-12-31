import { ThemeToggle } from '@/components/global/theme-toggle';
import Link from 'next/link';
import { ThemeAnimate } from './client';

export default function AuthHeader() {
	return (
		<header className='border-b px-[4%]'>
			<div className='max-w-maxi mx-auto h-16 flex items-center justify-between'>
				<div className='flex items-center justify-center'>
					<Link href={'/'} className='font-semibold'>
						Linkly
					</Link>
				</div>
				<nav className='flex items-center justify-center sm:gap-5 gap-3'>
					<ThemeAnimate>
						<ThemeToggle />
					</ThemeAnimate>
				</nav>
			</div>
		</header>
	);
}
