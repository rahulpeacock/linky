'use client';

import { useCopy } from '@/client/hooks/use-copy.hook';
import { dispatch, useAppSelector } from '@/client/store';
import { setupdateurl } from '@/client/store/slices/url-slice';
import { api } from '@/client/trpc';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Urls } from '@/server/db/schema/urls';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ElementRef, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	redirectUrl: z.string().url({ message: 'Enter a valid https URL!' }),
});

export function AddUrl() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			redirectUrl: '',
		},
	});
	const mutation = api.url.createUrl.useMutation({
		onSuccess: () => {
			router.refresh();
			form.reset({ redirectUrl: '' });
		},
	});

	function onSubmit(formData: z.infer<typeof formSchema>) {
		const { redirectUrl } = formData;
		const toastId = toast.loading('Shortening Url...');
		mutation.mutate(
			{ redirectUrl },
			{
				onSuccess: (data) => {
					toast.success('Url shortened', {
						id: toastId,
						description: (
							<span>
								Title: <span className='font-semibold'>{data.title}</span>
							</span>
						),
					});
				},
				onError: (err) => {
					toast.error('Failed to shorten', { id: toastId, description: err.message });
				},
			},
		);
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
				<Button size='lg' type='submit' disabled={mutation.isLoading}>
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

export function UrlSettings(props: Urls) {
	const { loading } = useAppSelector((state) => state.urlSlice).updateUrl;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className='p-1.5 h-auto w-auto group' variant='ghost' size='icon'>
					<Settings size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
				</Button>
			</SheetTrigger>
			<SheetContent
				className='flex items-stretch justify-start flex-col'
				onOpenAutoFocus={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => loading && e.preventDefault()}
				onPointerDown={(e) => loading && e.preventDefault()}
				onInteractOutside={(e) => loading && e.preventDefault()}
				loading={loading}
			>
				<SheetHeader>
					<SheetTitle>Update link</SheetTitle>
					<SheetDescription>Your can edit your shorten links</SheetDescription>
				</SheetHeader>
				<div className='py-2'>
					<UrlSettingsForm {...props} />
				</div>
				<SheetFooter className='mt-auto'>
					<DeleteUrl title={props.title} shortenUrl={props.shortenUrl} redirectUrl={props.redirectUrl} />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

const settingsFormSchema = z.object({
	title: z
		.string()
		.min(2, { message: 'Title must contain at least 2 characters!' })
		.max(255, { message: 'Title must contain at least 255 characters' }),
	shortenUrl: z.string(),
	redirectUrl: z.string().url({ message: 'Enter a valid https redirect URL!' }),
});

function UrlSettingsForm(props: Urls) {
	const router = useRouter();
	const form = useForm<z.infer<typeof settingsFormSchema>>({
		resolver: zodResolver(settingsFormSchema),
		defaultValues: {
			title: props.title,
			shortenUrl: props.shortenUrl,
			redirectUrl: props.redirectUrl,
		},
	});
	const mutation = api.url.updateUrl.useMutation({
		onSuccess: (data) => {
			if (data.success && data.url) {
				form.reset(data.url[0]);
				router.refresh();
				return;
			}
		},
		onSettled: () => {
			dispatch(setupdateurl({ loading: false }));
		},
	});

	function onSubmit(values: z.infer<typeof settingsFormSchema>) {
		const toastId = toast.loading('Updating Url...');
		dispatch(setupdateurl({ loading: true }));

		const dirtyFieldKeys = Object.keys(form.formState.dirtyFields);
		const dirtyFields = Object.fromEntries(Object.entries(values).filter(([key, val]) => dirtyFieldKeys.includes(key)));
		const payload = settingsFormSchema.partial().parse(dirtyFields);

		mutation.mutate(
			{ payload, title: props.title, shortenUrl: props.shortenUrl },
			{
				onSuccess: (data) => {
					if (data.success && data.url) {
						toast.success('Url updated successfully', {
							id: toastId,
							description: (
								<span>
									Title: <span className='font-semibold'>{data.url[0]?.title}</span>
								</span>
							),
						});
						return;
					}
					toast.info('Url update failed!', {
						id: toastId,
						description: data.message,
					});
				},
				onError: (err) => {
					toast.error('Failed to update url!', { id: toastId, description: err.message });
				},
			},
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder='Url title' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='shortenUrl'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Short URL</FormLabel>
							<FormControl>
								<Input placeholder='Your short url' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='redirectUrl'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Redirect URL</FormLabel>
							<FormControl>
								<Input placeholder='Your redirect url' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' className='w-full' disabled={!form.formState.isDirty || mutation.isLoading}>
					Update Url
				</Button>
			</form>
		</Form>
	);
}

function DeleteUrl({ title, shortenUrl, redirectUrl }: Pick<Urls, 'shortenUrl' | 'redirectUrl' | 'title'>) {
	const router = useRouter();
	const sheetCloseRef = useRef<ElementRef<typeof SheetClose>>(null);
	const [isWarning, setIsWarning] = useState(false);
	const mutation = api.url.deleteUrl.useMutation({
		onSuccess: () => {
			router.refresh();
		},
	});

	function handleClick() {
		if (isWarning) {
			const toastId = toast.loading('Deleting Url...');
			mutation.mutate(
				{ shortenUrl, title },
				{
					onSuccess: (data) => {
						toast.success('Url deleted successfully', {
							id: toastId,
							description: (
								<span>
									Title: <span className='font-semibold'>{data.url[0]?.title}</span>
								</span>
							),
						});
						sheetCloseRef.current?.click();
					},
					onError: (err) => {
						toast.error('Failed to delete url!', {
							id: toastId,
							description: (
								<span>
									Title: <span className='font-semibold'>{err.message}</span>
								</span>
							),
						});
					},
				},
			);
			return;
		}

		// When isWarning === false
		setIsWarning(true);
	}

	return (
		<div className='w-full'>
			<AnimatePresence>
				{isWarning && (
					<motion.div
						initial={{ opacity: 0, translateY: 20 }}
						animate={{ opacity: 1, translateY: 0 }}
						exit={{ opacity: 0, translateY: 20 }}
						transition={{ type: 'tween' }}
					>
						<p className='text-sm py-3 text-center text-muted-foreground'>
							Are you sure you want to delete -{' '}
							<Button className='font-medium p-0 text-muted-foreground' variant='link'>
								<Link href={redirectUrl} target='_blank' rel='noreferrer'>
									{title}
								</Link>
							</Button>
						</p>
					</motion.div>
				)}
			</AnimatePresence>
			<Button className='w-full' type='button' variant='destructive' onClick={handleClick} disabled={mutation.isLoading}>
				Delete Url
			</Button>
			{isWarning ? <SheetClose ref={sheetCloseRef} /> : null}
		</div>
	);
}
