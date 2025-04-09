import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from '@/components/ui/Select'
import { useForm } from 'react-hook-form'
import { Label } from './ui/Label'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const apiSchema = z.object({
	method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
	url: z.string().url('Enter a valid URL'),
	headers: z.string().optional(),
	body: z.string().optional()
})

type ApiFormData = z.infer<typeof apiSchema>

export function ApiModal({
	open,
	onSave,
	onClose
}: {
	open: boolean
	onSave: (data: ApiFormData) => void
	onClose: () => void
}) {
	const form = useForm<ApiFormData>({
		resolver: zodResolver(apiSchema),
		defaultValues: {
			method: 'GET',
			url: 'https://matbook.free.beeceptor.com/api/test',
			headers: '',
			body: ''
		}
	})

	const handleSubmit = (data: ApiFormData) => {
		onSave(data)
		form.reset()
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogHeader>
				<DialogTitle></DialogTitle>
			</DialogHeader>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="method"
							render={({ field }) => (
								<FormItem>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<div>
												<Label htmlFor="method">Method</Label>
												<SelectTrigger>
													<SelectValue placeholder="Select HTTP method" />
												</SelectTrigger>
											</div>
										</FormControl>
										<SelectContent>
											{['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(
												method => (
													<SelectItem key={method} value={method}>
														{method}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div>
											<Label htmlFor="url">URL</Label>
											<Input
												placeholder="https://api.example.com"
												{...field}
												disabled
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="headers"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div>
											<Label htmlFor="headers">Headers</Label>
											<Textarea
												placeholder='{"Authorization": "Bearer xyz"}'
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="body"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div>
											<Label htmlFor="body">Body</Label>
											<Textarea placeholder='{"key": "value"}' {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2">
							<Button type="submit" className="!py-2">
								Save
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
