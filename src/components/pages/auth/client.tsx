'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function ThemeAnimate({ children }: { children: ReactNode }) {
	return (
		<motion.div initial={{ x: -129 }} animate={{ x: 0 }} transition={{ type: 'spring', duration: 0.5 }}>
			{children}
		</motion.div>
	);
}
