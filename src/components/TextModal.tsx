import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Label } from '@/components/ui/Label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const textSchema = z.object({
	message: z.string().min(1, 'Message cannot be empty')
})

type TextFormData = z.infer<typeof textSchema>

export function TextModal({
	open,
	onSave,
	onClose
}: {
	open: boolean
	onSave: (data: TextFormData) => void
	onClose: () => void
}) {
	const form = useForm<TextFormData>({
		resolver: zodResolver(textSchema),
		defaultValues: {
			message: ''
		}
	})

	const handleSubmit = (data: TextFormData) => {
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
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
						<FormField
							control={form.control}
							name="message"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div>
											<Label htmlFor="message">Message</Label>
											<Textarea
												placeholder="Enter your message here..."
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
