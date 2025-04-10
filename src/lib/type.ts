// types/workflow.ts

export type NodeType = 'api' | 'email' | 'text'

export type ApiNode = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	url: string
	headers?: string
	body?: string
}

export type EmailNode = {
	email: string
}

export type TextNode = {
	message: string
}

export type WorkflowNode = {
	id: string
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
	nodes: WorkflowNode[],
	statusHistory: { 
		status: string; 
		timestamp: string; 
	  }[];
}
