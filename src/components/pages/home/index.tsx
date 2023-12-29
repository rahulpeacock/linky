import { Button } from '@/components/ui/button';
import { AUTH_PAGES } from '@/constants/auth';
import { getServerAuthSession } from '@/server/auth';
import { LayoutDashboard, LogIn } from 'lucide-react';
import Link from 'next/link';

export default async function HeroAuth() {
	const session = await getServerAuthSession();

	if (!session)
		return (
			<Button asChild>
				<Link href={AUTH_PAGES.signIn}>
					Sign in <LogIn size={16} className='ml-2' strokeWidth={2.5} />
				</Link>
			</Button>
		);

	return (
		<Button asChild>
			<Link href={'/dashboard'} className='gap-2'>
				Go to Dashboard <LayoutDashboard size={18} strokeWidth={2} />
			</Link>
		</Button>
	);
}
