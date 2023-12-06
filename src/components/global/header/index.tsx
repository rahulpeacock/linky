import Link from 'next/link';
import { HeaderAuth } from './client';

export default function Header() {
	return (
		<header className='border-b'>
			<div className='max-w-maxi mx-auto h-16 flex items-center justify-between'>
				<div className='flex items-center justify-center'>
					<Link href={'/'} className='font-semibold'>
						Linkly
					</Link>
				</div>
				<nav className='flex items-center justify-center'>
					<HeaderAuth />
				</nav>
			</div>
		</header>
	);
}
