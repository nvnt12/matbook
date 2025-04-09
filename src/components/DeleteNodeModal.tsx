import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface DeleteNodeModalProps {
	open: boolean
	onClose: () => void
	onConfirm: () => void
}

export function DeleteNodeModal({ open, onClose, onConfirm }: DeleteNodeModalProps) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle></DialogTitle>
				</DialogHeader>
				<DialogDescription className="text-center text-sm text-[#333333] capitalize py-2">
					Are you sure you want to delete this node?
					<span className="text-red-500 block mt-2 text-xs">
						You cannot undo this step
					</span>
				</DialogDescription>

				<div className="flex justify-end gap-2">
					<Button
						type="button"
						className="!py-2 w-fit"
						variant="outline"
						onClick={onClose}
					>
						No
					</Button>
					<Button
						type="button"
						className="!py-2"
						onClick={() => {
							onConfirm()
							onClose()
						}}
					>
						Yes
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
