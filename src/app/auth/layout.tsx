import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

export default async function AuthLayout({
	children,
}: {
	children: ReactNode;
}) {
	const auth = await getServerAuthSession();
	if (auth?.user) return redirect('/');

	return <>{children}</>;
}
