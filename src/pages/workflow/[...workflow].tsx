import { useEffect, useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { FaSave, FaTrashAlt } from 'react-icons/fa'
import { AddNodeModal } from '@/components/AddNodeModal'
import { useRouter } from 'next/router'
import { SaveWorkflowModal } from '@/components/SaveWorkflowModal'
import { HiArrowLeft } from 'react-icons/hi'
import { ApiNode, EmailNode, NodeType, TextNode, Workflow, WorkflowNode } from '@/lib/type'
import { getUserIdFromToken } from '@/hooks/getUserIdFromToken'
import { DeleteNodeModal } from '@/components/DeleteNodeModal'
import { runNode } from '@/lib/utils'

const NODE_LABELS: Record<NodeType, string> = {
	api: 'API Call',
	email: 'Email',
	text: 'Text Box'
}

export default function FlowEditor() {
	const router = useRouter()
	const userId = getUserIdFromToken()
	const [nodes, setNodes] = useState<WorkflowNode[]>([])
	const [zoom, setZoom] = useState(1)
	const [addModalOpen, setAddModalOpen] = useState(false)
	const [saveModalOpen, setSaveModalOpen] = useState(false)
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

	const handleAddNode = (type: NodeType, data: ApiNode | EmailNode | TextNode) => {
		const newNode: WorkflowNode = {
			id: crypto.randomUUID(), // unique ID
			type,
			data
		}
		setNodes(prev => [...prev, newNode])
		console.log('New node added:', newNode)
	}

	const handleSaveWorkflow = async (
		data: Pick<Workflow, 'name' | 'description'> & {
			author: Pick<Workflow['author'], 'firstName' | 'lastName'>
		}
	) => {
		const results = await Promise.all(nodes.map(runNode))
		const overallStatus = results.every(r => r === 'passed') ? 'passed' : 'failed'

		const workflow = {
			workflowId: '',
			userId: userId,
			name: data.name,
			description: data.description,
			author: {
				firstName: data.author.firstName,
				lastName: data.author.lastName
			},
			nodes: nodes,
			status: overallStatus
		}

		try {
			const res = await fetch('/api/workflow/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(workflow)
			})

			if (!res.ok) throw new Error('Failed to save workflow')

			const data = await res.json()
			console.log('Workflow saved:', data)
			setSaveModalOpen(false)
			alert('Workflow saved successfully!')
			router.push('/workflow-list')
		} catch (err) {
			console.error('Error saving workflow:', err)
			alert('Something went wrong.')
		}
	}

	const deleteNode = (index: number) => {
		const newNodes = [...nodes]
		newNodes.splice(index, 1)
		setNodes(newNodes)
	}

	const zoomIn = () => setZoom(z => Math.min(2, z + 0.1))
	const zoomOut = () => setZoom(z => Math.max(0.5, z - 0.1))
	
	useEffect(() => {
		const token = localStorage.getItem('token')

		if (!token) {
			router.replace('/workflow-list')
		}
	}, [])

	return (
		<div
			className="relative h-screen w-full overflow-auto bg-[#fdf6ec] p-10 pt-16"
			style={{
				backgroundImage: 'radial-gradient(#d7cbb3 1px, transparent 1px)',
				backgroundSize: '20px 20px'
			}}
		>
			{/* Toolbar */}
			<div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-xl shadow flex items-center gap-4 text-sm font-medium">
				<button
					type="button"
					className="cursor-pointer flex gap-2 items-center"
					onClick={() => router.push('/workflow-list')}
				>
					<HiArrowLeft />
					Go Back
				</button>
				<span className="text-gray-500">Untitled</span>
				<button
					onClick={() => setSaveModalOpen(true)}
					className="text-yellow-500 cursor-pointer"
				>
					<FaSave />
				</button>
			</div>

			{/* Zoom control */}
			<div className="absolute bottom-20 z-10 right-8 bg-white rounded-xl shadow px-4 py-2 flex items-center gap-2">
				<div className="w-fit">
					<div className="w-2 h-2 rounded-full bg-lime-500 ring-2 ring-lime-300 mr-2 ring-offset-2 ring-offset-white" />
				</div>
				<button type="button" className="cursor-pointer" onClick={zoomOut}>
					<FiMinus size={14} />
				</button>
				<input
					type="range"
					min="0.5"
					max="2"
					step="0.1"
					value={zoom}
					className="h-1 w-40 appearance-none mx-1"
					style={{
						WebkitAppearance: 'none',
						width: '100%',
						height: '4px',
						background: '#828282',
						borderRadius: '9999px',
						outline: 'none',
						cursor: 'pointer',
						accentColor: '#4F4F4F'
					}}
					onChange={e => setZoom(parseFloat(e.target.value))}
				/>
				<button type="button" className="cursor-pointer" onClick={zoomIn}>
					<FiPlus size={14} />
				</button>
			</div>

			{/* Flow Area */}
			<div
				className="flex flex-col items-center transition-transform duration-300"
				style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
			>
				{/* Start */}
				<div className="w-20 h-20 flex justify-center items-center">
					<div className="flex justify-center items-center w-16 h-16 rounded-full bg-[#849E4C] text-white px-5 py-2 font-semibold ring-4 ring-[#849E4C] ring-offset-4 ring-offset-white">
						Start
					</div>
				</div>

				{nodes.map((node, i) => (
					<div key={i} className="flex flex-col items-center">
						{/* Connector */}
						<div className="relative flex flex-col items-center">
							<div className="w-px h-4 bg-[#4F4F4F]" />
							<button
								onClick={() => setAddModalOpen(true)}
								className="rounded-full border border-[#4F4F4F] w-6 h-6 flex items-center justify-center bg-white text-xs"
							>
								<FiPlus size={14} />
							</button>
							<div className="w-px h-4 bg-[#4F4F4F]" />
						</div>
						<div className="w-64 bg-white border border-[#849E4C] rounded-md p-4 shadow flex justify-between items-center">
							<span className="text-xs">{NODE_LABELS[node.type]}</span>
							<button onClick={() => setDeleteIndex(i)}>
								<FaTrashAlt className="text-red-500" size={12} />
							</button>
						</div>
					</div>
				))}

				{/* Connector before End */}
				<div className="w-px h-4 bg-[#4F4F4F]" />
				<button
					onClick={() => setAddModalOpen(true)}
					className="rounded-full border border-[#4F4F4F] w-6 h-6 flex items-center justify-center bg-white text-xs"
				>
					<FiPlus size={14} />
				</button>
				<div className="w-px h-4 bg-[#4F4F4F]" />

				{/* End */}
				<div className="w-20 h-20 flex justify-center items-center">
					<div className="flex justify-center items-center w-16 h-16 rounded-full bg-[#EE3425] text-white px-5 py-2 font-semibold ring-4 ring-[#EE3425] ring-offset-4 ring-offset-white">
						End
					</div>
				</div>
			</div>

			<AddNodeModal
				open={addModalOpen}
				onClose={() => setAddModalOpen(false)}
				onSelectType={type => {
					console.log('Selected type:', type)
				}}
				onAddNode={handleAddNode}
			/>

			<DeleteNodeModal
				open={deleteIndex !== null}
				onClose={() => setDeleteIndex(null)}
				onConfirm={() => {
					if (deleteIndex !== null) {
						deleteNode(deleteIndex)
					}
				}}
			/>

			<SaveWorkflowModal
				open={saveModalOpen}
				onClose={() => setSaveModalOpen(false)}
				onSubmit={handleSaveWorkflow}
			/>
		</div>
	)
}
