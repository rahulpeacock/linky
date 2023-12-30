import { withAuth } from 'next-auth/middleware';
import { AUTH_PAGES } from './constants/auth';

export default withAuth({
	pages: AUTH_PAGES,
});

export const config = { matcher: ['/dashboard'] };
