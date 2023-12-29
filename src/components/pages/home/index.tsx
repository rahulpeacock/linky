import { Button } from '@/components/ui/button';
import { getServerAuthSession } from '@/server/auth';
import { LayoutDashboard, LogIn } from 'lucide-react';
import Link from 'next/link';

export default async function HeroAuth() {
	const session = await getServerAuthSession();

	if (!session)
		return (
			<Button>
				Sign in <LogIn size={16} className='ml-2' strokeWidth={2.5} />
			</Button>
		);

	return (
		<Button>
			<Link href={'/dashboard'} className='flex items-center justify-center gap-2'>
				Dashboard <LayoutDashboard size={18} strokeWidth={2} />
			</Link>
		</Button>
	);
}
