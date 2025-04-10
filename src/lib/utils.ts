import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ApiNode, EmailNode, WorkflowNode } from './type'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export async function runNode(node: WorkflowNode): Promise<'passed' | 'failed'> {
		if (node.type === 'text') return 'passed'

		if (node.type === 'email') {
			const emailData = node.data as EmailNode
			return emailData.email ? 'passed' : 'failed'
		}

		if (node.type === 'api') {
			const apiData = node.data as ApiNode
			try {
				const res = await fetch(apiData.url, {
					method: apiData.method,
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer your-token'
					},
					body: apiData.method !== 'GET' ? JSON.stringify(apiData.body) : undefined
				})
				console.log('API response:', res)
				return res.ok ? 'passed' : 'failed'
			} catch (e) {
				console.log(e)
				return 'failed'
			}
		}
		return 'failed'
	}

export const formatDateTimestamp = (timestamp: string): string => {
	const date = new Date(timestamp);
	
	const time = date.toLocaleTimeString('en-IN', {
	  hour: '2-digit',
	  minute: '2-digit',
	  hour12: false,
	});
  
	const day = date.toLocaleDateString('en-IN').split('/').join('/');
  
	return `${time} - ${day}`;
  };
  