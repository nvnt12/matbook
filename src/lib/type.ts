// types/workflow.ts

export type NodeType = 'api' | 'email' | 'text'

export type ApiNode = {
	type: 'api'
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	url: string
	headers?: Record<string, string>
	body?: string
}

export type EmailNode = {
	type: 'email'
	email: string
}

export type TextNode = {
	type: 'text'
	message: string
}

export type WorkflowNode = {
	id: string // unique ID for node
	type: NodeType
	data: ApiNode | EmailNode | TextNode
}

export type Workflow = {
	name: string
	description: string
	author: {
		firstName: string
		lastName: string
	}
	workflowId: string
	updatedAt: string
	status: string
	nodes: WorkflowNode[]
}
