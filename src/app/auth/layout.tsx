import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const auth = await getServerAuthSession();
	if (auth?.user) return redirect('/dashboard');

	return <>{children}</>;
}
