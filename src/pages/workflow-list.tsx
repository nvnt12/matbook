import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/Table'
import { BsPinAngle } from 'react-icons/bs'
import { RxDotsVertical, RxExternalLink } from 'react-icons/rx'
import { GoArrowDown } from 'react-icons/go'
import { HiOutlineMenu } from 'react-icons/hi'
import { useRouter } from 'next/router'
import { Workflow } from '@/lib/type'
import { getUserIdFromToken } from '@/hooks/getUserIdFromToken'
import { cn, formatDateTimestamp, runNode } from '@/lib/utils'

export default function WorkflowTable() {
	const router = useRouter()
	const [search, setSearch] = useState('')
	const [workflows, setWorkflows] = useState([])

	const [expandedRows, setExpandedRows] = useState<number[]>([])

	const toggleRow = (index: number) => {
		setExpandedRows(prev =>
			prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
		)
	}

	const fetchWorkflows = async (searchQuery = '') => {
		const userId = getUserIdFromToken()
		if (!userId) return

		try {
			const res = await fetch(`/api/workflow-list?userId=${userId}&search=${searchQuery}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!res.ok) throw new Error('Failed to fetch workflows')

			const data = await res.json()

			const formatted = data.map((workflow: { _id: string } & Workflow) => {
				return {
					id: workflow._id,
					name: workflow.name,
					workflowId: `#${workflow.workflowId}`,
					author: workflow.author,
					updatedAt: formatDateTimestamp(workflow.updatedAt),
					description: workflow.description,
					status: workflow.status,
					statusHistory: workflow.statusHistory,
					nodes: workflow.nodes,
				}
			})

			setWorkflows(formatted)
		} catch (err) {
			console.error('Error fetching workflows:', err)
		}
	}

	const handleWorkFlowExecution = async (workflow:  { id: string } & Workflow ) => {
		const results = await Promise.all(workflow.nodes.map(runNode))
		const overallStatus = results.every(r => r === 'passed') ? 'passed' : 'failed'
	
		const statusHistoryUpdate = {
			status: overallStatus,
			timestamp: new Date()
		}
	
		try {
			const res = await fetch('/api/workflow/update-status', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					workflowId: workflow.id,          
					status: overallStatus,
					statusHistory: statusHistoryUpdate
				})
			})
	
			if (!res.ok) throw new Error('Failed to update workflow status')
	
			const updatedWorkflow = await res.json()
			console.log('Workflow status updated:', updatedWorkflow)
			fetchWorkflows(search)
			alert('Workflow status updated successfully!')
		} catch (err) {
			console.error('Error updating workflow status:', err)
			alert('Something went wrong.')
		}
	}

	useEffect(() => {
		const debounceTimer = setTimeout(() => {
			fetchWorkflows(search)
		}, 300)

		return () => clearTimeout(debounceTimer)
	}, [search])

	return (
		<div className="p-6">
			<div className="flex items-center mb-4 gap-4">
				<Button variant="outline" className="w-fit !p-1.5">
					<HiOutlineMenu className="cursor-pointer" size={18} />
				</Button>
				<h1 className="text-xl font-bold">Workflow Builder</h1>
			</div>
			<div className="pl-0 sm:pl-10">
				<div className="flex flex-wrap gap-4 items-center justify-between mb-4">
					<Input
						className="w-96 border-black"
						placeholder="Search by Workflow Name/ID"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
					<Button
						type="button"
						variant="secondary"
						onClick={() => router.push('/workflow/new')}
					>
						+ Create New Process
					</Button>
				</div>
				<Table className="border-none">
					<TableHeader>
						<TableRow>
							<TableHead>Workflow Name</TableHead>
							<TableHead>ID</TableHead>
							<TableHead>Last Edited On</TableHead>
							<TableHead>Description</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{workflows.map((workflow:  { id: string } & Workflow, index) => (
							<React.Fragment key={index}>
								<TableRow>
									<TableCell>{workflow?.name}</TableCell>
									<TableCell>{workflow?.workflowId}</TableCell>
									<TableCell className="text-xs">
										{workflow?.author?.firstName || ''}{' '}
										{workflow?.author?.lastName || ''} | {workflow.updatedAt}
									</TableCell>
									<TableCell className="text-xs">
										{workflow?.description}
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-3 justify-end">
											<BsPinAngle className="text-black" size={16} />
											<Button
												type="button"
												variant="outline"
												className="w-fit !py-1.5 text-xs text-black"
												onClick={() => handleWorkFlowExecution(workflow)}
											>
												Execute
											</Button>
											<Button
												type="button"
												variant="outline"
												className="w-fit !py-1.5 text-xs text-black"
											>
												Edit
											</Button>
											<RxDotsVertical className="cursor-pointer" size={16} />
											<GoArrowDown
												className={cn(
													'cursor-pointer mr-2',
													expandedRows.includes(index) ? 'rotate-180' : ''
												)}
												size={16}
												onClick={() => toggleRow(index)}
											/>
										</div>
									</TableCell>
								</TableRow>

								{/* Expandable status row */}
								{expandedRows.includes(index) && (
									<>
									{workflow.statusHistory.map((entry, idx) => (
										<TableRow key={idx} className="bg-[#FFFAF2]">
										<TableCell colSpan={6} className="py-2 px-6">
											<div className="flex items-center gap-2 text-xs font-medium">
											<span className="w-4 h-4 rounded-full bg-[#FF5200] inline-block border-4 border-[#FFE1D2]"></span>
											<span>{formatDateTimestamp(entry.timestamp)}</span> {/* Format and display timestamp */}
											<span
												className={cn(
												'px-2 py-0.5 rounded-md ml-2 text-xs text-black capitalize',
												entry.status === 'passed'
													? 'bg-[#DDEBC0]'
													: entry.status === 'failed'
													? 'bg-[#F8AEA8]'
													: 'bg-yellow-100'
												)}
											>
												{entry.status}
											</span>
											<RxExternalLink className="ml-2 cursor-pointer" size={16} />
											</div>
										</TableCell>
										</TableRow>
									))}
									</>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
