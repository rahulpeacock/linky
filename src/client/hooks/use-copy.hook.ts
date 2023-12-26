'use client';

import { useState } from 'react';
import { ToastT, toast } from 'sonner';

export function useCopy() {
	const [showCopy, setShowCopy] = useState(true);

	async function handleCopy(text: string, position?: ToastT['position']) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied to clipboard', { position });
			setShowCopy(false);
			setTimeout(() => setShowCopy(true), 900);
		} catch (err) {
			toast.error('Failed to copy!', { position });
		}
	}

	return { showCopy, handleCopy };
}
