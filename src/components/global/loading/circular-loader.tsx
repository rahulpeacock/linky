import { cn } from '@/lib/utils/cn';
import { Slot } from '@radix-ui/react-slot';

interface ExtendedLoadingProps {
	className?: string;
	asChild?: boolean;
}

export default function CircularLoader({ className, asChild = false }: ExtendedLoadingProps) {
	const Comp = asChild ? Slot : 'div';
	return (
		<Comp
			className={cn(
				'h-6 aspect-square rounded-full border-2 animate-loading-rotate bg-background border-t-grey-1050 border-x-background border-b-background',
				className,
			)}
		/>
	);
}
