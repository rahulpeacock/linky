'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function useCopy() {
	const [showCopy, setShowCopy] = useState(true);

	async function handleCopy(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied to clipboard');
			setShowCopy(false);
			setTimeout(() => setShowCopy(true), 900);
		} catch (err) {
			toast.error('Failed to copy!');
		}
	}

	return { showCopy, handleCopy };
}
