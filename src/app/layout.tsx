import NextAuthSession from '@/client/providers/next-auth-session';
import ReduxProvider from '@/client/providers/redux-provider';
import { ThemeProvider } from '@/client/providers/theme-provider';
import { TRPCReactProvider } from '@/client/providers/trpc-react-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/main.scss';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { type ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		template: 'Linky - %s',
		default: 'Linky',
	},
	description: 'A url-shortener using next.js, tRPC, drizzle-orm with supabase(postgresql)',
};

export default function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${inter.className}`}>
				<TRPCReactProvider cookies={cookies().toString()}>
					<ReduxProvider>
						<NextAuthSession>
							<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
								{children}
								<Toaster />
							</ThemeProvider>
						</NextAuthSession>
					</ReduxProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
