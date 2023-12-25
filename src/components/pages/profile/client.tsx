'use client';

import { useCopy } from '@/client/hooks/use-copy.hook';
import { api } from '@/client/trpc';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	redirectUrl: z.string().url({ message: 'Enter a valid https URL!' }),
});

export function AddUrl() {
	const { handleCopy } = useCopy();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			redirectUrl: '',
		},
	});
	const mutation = api.url.createUrl.useMutation({
		onSuccess: (data) => {
			toast.success('Url shortened', {
				description: data[0]?.shortenUrl,
				action: {
					label: 'Copy url',
					onClick: (e) => {
						e.preventDefault();
						handleCopy(data[0]?.shortenUrl as string);
						console.log('copied to clipboard');
					},
				},
			});
		},
		onError: (err) => {
			toast.error('Failed to shorten', { description: err.message });
		},
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		const { redirectUrl } = formData;
		mutation.mutate({ redirectUrl });
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='flex items-start justify-center gap-4 max-w-2xl mx-auto'>
				<FormField
					control={form.control}
					name='redirectUrl'
					render={({ field }) => (
						<FormItem className='w-full'>
							<FormControl>
								<Input className='h-10' placeholder='https://github.com' autoComplete='off' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button size='lg' type='submit'>
					Shorten
				</Button>
			</form>
		</Form>
	);
}

export function CopyLink({ shortenUrl }: { shortenUrl: string }) {
	const { handleCopy } = useCopy();

	return (
		<Button className='p-1.5 h-auto w-auto ml-auto mr-1 group' variant='ghost' size='icon' onClick={() => handleCopy(shortenUrl)}>
			<Copy size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
		</Button>
	);
}

export function LinkSettings() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className='p-1.5 h-auto w-auto group' variant='ghost' size='icon'>
					<Settings size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Update link</SheetTitle>
					<SheetDescription>Your can edit your shorten links</SheetDescription>
				</SheetHeader>
				<div>
					<p>hello world</p>
				</div>
			</SheetContent>
		</Sheet>
	);
}
