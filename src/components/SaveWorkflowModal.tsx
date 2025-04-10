import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import { Label } from './ui/Label'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const saveWorkflowSchema = z.object({
	name: z.string().min(1, 'Workflow name is required'),
	description: z.string().min(1, 'Description is required'),
	author: z.object({
		firstName: z.string().min(1, 'First name is required'),
		lastName: z.string().min(1, 'Last name is required')
	})
})

type SaveWorkflowFormData = z.infer<typeof saveWorkflowSchema>

export const SaveWorkflowModal = ({
	open,
	onClose,
	onSubmit
}: {
	open: boolean
	onClose: () => void
	onSubmit: (data: SaveWorkflowFormData) => void
}) => {
	const form = useForm<SaveWorkflowFormData>({
		resolver: zodResolver(saveWorkflowSchema),
		defaultValues: {
			name: '',
			description: '',
			author: {
				firstName: '',
				lastName: ''
			}
		}
	})

	const handleSubmit = form.handleSubmit(values => {
		onSubmit(values)
	})

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Save your Workflow</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div>
											<Label>Workflow Name</Label>
											<Input placeholder="Enter workflow name" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div>
											<Label>Description</Label>
											<Input
												placeholder="Describe your workflow"
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-2">
							<FormField
								control={form.control}
								name="author.firstName"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<div>
												<Label>First Name</Label>
												<Input placeholder="John" {...field} />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="author.lastName"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<div>
												<Label>Last Name</Label>
												<Input placeholder="Doe" {...field} />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end">
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
