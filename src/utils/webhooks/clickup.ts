import { DetailJob } from '@/types/job';

// ClickUp API Configuration
const CLICKUP_API_TOKEN = import.meta.env.VITE_CLICKUP_API_TOKEN;
const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';

// Environment-specific configuration
const CLICKUP_CONFIG = {
  test: {
    workspaceId: '8555561', // Ben's BC WorkSpace
    listId: '901703694310', // Automation Team Board
    templateId: 't-86b3exqe8' // LOE New Template 2025.01.09
  },
  production: {
    workspaceId: '9014181018', // Valta workspace
    listId: '901402094744', // Chris's list
    templateId: 't-86b3exqe8' // LOE New Template 2025.01.09
  }
};

// Use test environment by default, switch to production when ready
const ENV = import.meta.env.VITE_CLICKUP_ENV || 'test';
const config = CLICKUP_CONFIG[ENV as keyof typeof CLICKUP_CONFIG];

export interface ClickUpTaskData {
  name: string;
  description?: string;
  markdown_description?: string;
  status?: string;
  priority?: number;
  custom_fields?: Array<{
    id: string;
    value: string | number;
  }>;
  tags?: string[];
  checklist?: Array<{
    name: string;
    resolved?: boolean;
  }>;
}

// Map APR job data to ClickUp custom fields - SIMPLIFIED!
// We're keeping it minimal - just a link to the hub
export function mapJobToClickUpFields(job: DetailJob): Array<{id: string; value: string | number}> {
  // Minimal field mapping - just what's essential
  // The team can view full details in the APR Hub
  return [
    // Add custom field for APR Hub link if template has one
    // Otherwise, the link is in the description
  ];
}

// RETIRED 2026-06-03 (CoArch dedup): Stage-1 ClickUp task creation is now owned SOLELY by the
// Supabase edge function `create-clickup-task` (supabase/functions/create-clickup-task/index.ts),
// which builds the RICH Summit-Tower card and wires into the Stage-2 + status-tracker chain.
// This lean client-side builder produced a divergent card and is no longer wired to anything.
// Do NOT re-introduce a client-side builder — call the edge function instead (see ClickUpAction.tsx).
/** @deprecated Use the `create-clickup-task` Supabase edge function. This stub exists only to fail loudly. */
export async function createClickUpTask(
  _job: DetailJob,
  _valcreJobNumber?: string,
  _useTemplate: boolean = true
): Promise<{ success: boolean; taskId?: string; taskUrl?: string; error?: string }> {
  const msg = 'createClickUpTask (client) is retired. Call the create-clickup-task edge function (see ClickUpAction.tsx).';
  console.error(`❌ ${msg}`);
  return { success: false, error: msg };
}

// Update ClickUp task status
export async function updateClickUpTaskStatus(
  taskId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${CLICKUP_API_BASE}/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`Failed to update task status: ${response.status}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating ClickUp task:', error);
    return { success: false, error: error.message };
  }
}

// Update ClickUp task when Valcre job is created
export async function updateClickUpWithValcreJob(
  taskId: string,
  valcreJobNumber: string,
  valcreJobId?: number,
  propertyName?: string,
  propertyAddress?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const fullAddress = propertyName && propertyAddress
      ? `${propertyName}, ${propertyAddress}`
      : propertyAddress || 'Property Address';
    
    // Build hub URL for updated description
    const hubUrl = process.env.VITE_APP_URL || 'http://localhost:8080';
    
    const updates: any = {
      name: `${valcreJobNumber} - ${fullAddress}`,
      markdown_description: `
📍 **JOB BOOKED - ${valcreJobNumber}**

**[➡️ View in APR Hub](${hubUrl}/#/dashboard)**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Valcre Job:** ${valcreJobNumber}
**Property:** ${fullAddress}
**Status:** Job booked and ready for processing

---
*Track progress and manage workflow in APR Hub*
      `.trim()
    };

    const response = await fetch(`${CLICKUP_API_BASE}/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.status}`);
    }
    
    console.log(`✅ Updated ClickUp task name to: ${updates.name}`);

    // Mark "Book Job" subtask as complete
    await updateClickUpChecklist(taskId, '9. Book Job', true);

    return { success: true };
  } catch (error: any) {
    console.error('Error updating ClickUp task with Valcre info:', error);
    return { success: false, error: error.message };
  }
}

// Update checklist item when actions happen in APR Hub
export async function updateClickUpChecklist(
  taskId: string,
  checklistItem: string,
  resolved: boolean = true
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, get the task to find the checklist
    const getResponse = await fetch(`${CLICKUP_API_BASE}/task/${taskId}`, {
      headers: {
        'Authorization': CLICKUP_API_TOKEN
      }
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to get task: ${getResponse.status}`);
    }

    const task = await getResponse.json();
    
    // Find and update the checklist item
    if (task.checklists && task.checklists.length > 0) {
      const checklist = task.checklists[0];
      const item = checklist.items?.find((i: any) => i.name.includes(checklistItem));
      
      if (item) {
        // Update the specific checklist item
        const updateResponse = await fetch(
          `${CLICKUP_API_BASE}/checklist/${checklist.id}/checklist_item/${item.id}`, 
          {
            method: 'PUT',
            headers: {
              'Authorization': CLICKUP_API_TOKEN,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ resolved })
          }
        );

        if (!updateResponse.ok) {
          throw new Error(`Failed to update checklist item: ${updateResponse.status}`);
        }

        console.log(`✅ Updated checklist item "${checklistItem}" to ${resolved ? 'complete' : 'incomplete'}`);
        return { success: true };
      }
    }

    return { success: false, error: 'Checklist item not found' };
  } catch (error: any) {
    console.error('Error updating checklist:', error);
    return { success: false, error: error.message };
  }
}

// Mark LOE preparation as complete (when LOE is ready to send)
export async function markLOEPrepComplete(taskId: string): Promise<{ success: boolean; error?: string }> {
  // This marks the preparation subtask as complete
  // Try both possible subtask names
  const result1 = await updateClickUpChecklist(taskId, 'LOE Quote Preparation', true);
  if (!result1.success) {
    // Try alternative name
    return updateClickUpChecklist(taskId, 'Waiting for LOE Quote Preparation', true);
  }
  return result1;
}

// Mark LOE as sent when DocuSeal is triggered
export async function markLOESent(taskId: string): Promise<{ success: boolean; error?: string }> {
  return updateClickUpChecklist(taskId, '1. Create & Send LOE', true);
}

// Get workspace custom fields (for setup/debugging)
export async function getClickUpCustomFields(
  listId: string = config.listId
): Promise<{ fields?: any[]; error?: string }> {
  try {
    const response = await fetch(`${CLICKUP_API_BASE}/list/${listId}/field`, {
      headers: {
        'Authorization': CLICKUP_API_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get custom fields: ${response.status}`);
    }

    const result = await response.json();
    console.log('Custom fields for list:', result);
    
    return { fields: result.fields };
  } catch (error: any) {
    console.error('Error getting custom fields:', error);
    return { error: error.message };
  }
}