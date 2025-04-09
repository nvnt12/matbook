import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Label } from '@/components/ui/Label'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { EmailFormData } from '@/lib/type'

const emailSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email')
})

type EmailFormData = z.infer<typeof emailSchema>

export function EmailModal({
	open,
	onSave,
	onClose
}: {
	open: boolean
	onSave: (data: EmailFormData) => void
	onClose: () => void
}) {
	const form = useForm<EmailFormData>({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: ''
		}
	})

	const handleSubmit = (data: EmailFormData) => {
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
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div>
											<Label htmlFor="email">Email</Label>
											<Input
												type="email"
												placeholder="example@email.com"
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
