// pages/api/workflow/update-status.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { Workflow } from '@/models/WorkFlow';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { workflowId, status, statusHistory } = req.body;

  if (!workflowId || !status || !statusHistory || !statusHistory.timestamp) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    workflow.status = status;

    workflow.statusHistory.push(statusHistory);

    await workflow.save();

    return res.status(200).json({ message: 'Workflow status updated successfully', workflow });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating workflow status' });
  }
}
