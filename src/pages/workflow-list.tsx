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
import { cn } from '@/lib/utils'

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

			const formatted = data.map((workflow: Workflow) => {
				const date = new Date(workflow.updatedAt)
				const time = date.toLocaleTimeString('en-IN', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				})
				const day = date.toLocaleDateString('en-IN').split('/').join('/')

				return {
					name: workflow.name,
					workflowId: `#${workflow.workflowId}`,
					author: workflow.author,
					updatedAt: `${time} - ${day}`,
					description: workflow.description,
					status: workflow.status
				}
			})

			setWorkflows(formatted)
		} catch (err) {
			console.error('Error fetching workflows:', err)
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
			<div className="pl-10">
				<div className="flex items-center justify-between mb-4">
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
						<TableRow className="">
							<TableHead>Workflow Name</TableHead>
							<TableHead>ID</TableHead>
							<TableHead>Last Edited On</TableHead>
							<TableHead>Description</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{workflows.map((workflow: Workflow, index) => (
							<React.Fragment key={index}>
								{/* Main row */}
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
									<TableRow className="bg-[#FFFAF2]">
										<TableCell colSpan={6} className=" py-2 px-6">
											<div className="flex items-center gap-2 text-xs font-medium">
												<span className="w-4 h-4 rounded-full bg-[#FF5200] inline-block border-4 border-[#FFE1D2]"></span>
												<span>{workflow.updatedAt}</span>
												<span
													className={cn(
														'px-2 py-0.5 rounded-md ml-2 text-xs text-black capitalize',
														workflow.status === 'passed'
															? 'bg-[#DDEBC0]'
															: workflow.status === 'failed'
																? 'bg-[#F8AEA8]'
																: 'bg-yellow-100'
													)}
												>
													{workflow.status}
												</span>
												<RxExternalLink
													className="ml-2 cursor-pointer"
													size={16}
												/>
											</div>
										</TableCell>
									</TableRow>
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
