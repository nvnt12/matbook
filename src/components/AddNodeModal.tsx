import { Dialog, DialogContent, DialogHeader } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { ApiModal } from './ApiModal'
import { EmailModal } from './EmailModal'
import { TextModal } from './TextModal'
import { ApiNode, EmailNode, TextNode } from '@/lib/type'
import { DialogTitle } from '@radix-ui/react-dialog'

type NodeType = 'api' | 'email' | 'text'

export function AddNodeModal({
	open,
	onClose,
	onSelectType,
	onAddNode
}: {
	open: boolean
	onClose: () => void
	onSelectType: (type: NodeType) => void
	onAddNode: (type: NodeType, data: ApiNode | EmailNode | TextNode) => void
}) {
	const [typeModal, setTypeModal] = useState<NodeType | null>(null)

	const handleSelect = (type: NodeType) => {
		setTypeModal(type)
		onClose()
		onSelectType(type)
	}

	return (
		<>
			<Dialog open={open} onOpenChange={onClose}>
				<DialogHeader>
					<DialogTitle></DialogTitle>
				</DialogHeader>
				<DialogContent className=" w-2xs">
					<div className="flex gap-4 flex-wrap">
						<Button
							variant="outline"
							className="w-fit !py-2 text-black"
							onClick={() => handleSelect('api')}
						>
							API Call
						</Button>
						<Button
							variant="outline"
							className="w-fit !py-2 text-black"
							onClick={() => handleSelect('email')}
						>
							Email
						</Button>
						<Button
							variant="outline"
							className="w-fit !py-2 text-black"
							onClick={() => handleSelect('text')}
						>
							Text Box
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Show sub modals */}
			{typeModal === 'api' && (
				<ApiModal
					open
					onClose={() => setTypeModal(null)}
					onSave={(data: ApiNode) => {
						onAddNode('api', data)
						setTypeModal(null)
					}}
				/>
			)}
			{typeModal === 'email' && (
				<EmailModal
					open
					onClose={() => setTypeModal(null)}
					onSave={(data: EmailNode) => {
						onAddNode('email', data)
						setTypeModal(null)
					}}
				/>
			)}
			{typeModal === 'text' && (
				<TextModal
					open
					onClose={() => setTypeModal(null)}
					onSave={(data: TextNode) => {
						onAddNode('text', data)
						setTypeModal(null)
					}}
				/>
			)}
		</>
	)
}
