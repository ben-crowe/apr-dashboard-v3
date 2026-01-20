# Priority Colors Reference

**Date:** January 13, 2026  
**Purpose:** Document priority color coding matching Valta task board  
**Source:** Valta ClickUp task board images

---

## Priority Levels (From Valta Images)

Based on the priority dropdown visible in Valta task board images:

| Priority | API Value | Flag Color | Visual | Use Case |
|----------|-----------|-----------|--------|----------|
| **Urgent** | `1` | Red | Red flag icon | Critical, immediate attention required |
| **High** | `2` | Orange/Yellow | Orange flag icon | Important, prioritize soon |
| **Normal** | `3` | Blue | Blue flag icon | Standard priority (default for new tasks) |
| **Low** | `4` | Grey | Grey flag icon | Low priority, can wait |
| **Clear** | `null` or omit | None | No flag | No priority set |

---

## API Usage

### Setting Priority When Creating Task

```typescript
// Priority constants
const PRIORITY = {
  URGENT: 1,    // Red flag - Critical
  HIGH: 2,      // Orange flag - Important
  NORMAL: 3,    // Blue flag - Standard (default)
  LOW: 4        // Grey flag - Low priority
}

// Example: Create task with Urgent priority
const taskPayload = {
  name: "VAL251999 - Property Name, Address",
  priority: PRIORITY.URGENT,  // Sets red "Urgent" flag
  status: "TO DO"
}
```

### Setting Priority When Updating Task

```typescript
// Update task priority
const updatePayload = {
  priority: PRIORITY.HIGH  // Change to High priority (orange flag)
}
```

### Clearing Priority

```typescript
// Remove priority (set to "Clear")
const updatePayload = {
  priority: null  // or omit the field
}
```

---

## Edge Function Implementation

Update `create-clickup-task` Edge Function to use priority values:

```typescript
// In supabase/functions/create-clickup-task/index.ts

// Determine priority based on job data
let priority = 3; // Default: Normal (blue)

// Set Urgent priority for specific conditions
if (job.isUrgent || job.deliveryDate < addDays(new Date(), 7)) {
  priority = 1; // Urgent (red flag)
} else if (job.isHighPriority) {
  priority = 2; // High (orange flag)
}

const taskPayload = {
  name: taskName,
  markdown_description: description,
  priority: priority,  // 1=Urgent, 2=High, 3=Normal, 4=Low
  status: 'TO DO',
  // ... other fields
}
```

---

## Visual Reference

### Urgent Priority (Red Flag)
- **Color:** Red (#d32f2f or similar)
- **Icon:** Solid red flag
- **Display:** Bold red text "Urgent" with red flag icon
- **Use When:** Critical deadline, client escalation, urgent request

### High Priority (Orange Flag)
- **Color:** Orange/Yellow (#f57c00 or similar)
- **Icon:** Orange flag
- **Display:** Orange text "High" with orange flag icon
- **Use When:** Important but not critical, needs attention soon

### Normal Priority (Blue Flag)
- **Color:** Blue (#1976d2 or similar)
- **Icon:** Blue flag
- **Display:** Blue text "Normal" with blue flag icon
- **Use When:** Standard workflow, default for new tasks

### Low Priority (Grey Flag)
- **Color:** Grey (#757575 or similar)
- **Icon:** Grey flag
- **Display:** Grey text "Low" with grey flag icon
- **Use When:** Can wait, not time-sensitive

---

## Matching Valta Workflow

**Valta uses priority flags to visually organize tasks:**
- Tasks grouped by priority in list view
- Urgent tasks appear at top with red flags
- High priority tasks have orange flags
- Normal tasks have blue flags (most common)
- Low priority tasks have grey flags

**Our BC mirror should match this exactly:**
- Use same priority values (1-4)
- Colors will match automatically (ClickUp standard)
- Group tasks by priority in list view
- Set appropriate priority when creating tasks

---

## Testing Priority Colors

After setting up statuses, test priority colors:

```bash
# Create test task with Urgent priority
curl -X POST "https://api.clickup.com/api/v2/list/901709621852/task" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TEST - Urgent Priority Task",
    "priority": 1,
    "status": "TO DO"
  }'

# Create test task with High priority
curl -X POST "https://api.clickup.com/api/v2/list/901709621852/task" \
  -H "Authorization: pk_10791838_TPNA2KDR3VDVGMT3UHF6AZ66AN4NOIAY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TEST - High Priority Task",
    "priority": 2,
    "status": "TO DO"
  }'
```

Verify in ClickUp UI:
- Urgent task shows red flag
- High task shows orange flag
- Colors match Valta images exactly

---

## Priority Logic Recommendations

### When to Set Urgent (Priority 1)
- Delivery date within 7 days
- Client explicitly marked as urgent
- Escalation from client
- Critical deadline approaching

### When to Set High (Priority 2)
- Delivery date within 14 days
- Important client
- Complex property requiring early start
- High-value job

### When to Set Normal (Priority 3)
- Standard workflow
- Default for new submissions
- Normal delivery timeline
- Most common priority

### When to Set Low (Priority 4)
- Long delivery timeline (>30 days)
- Low complexity job
- Non-time-sensitive request
- Internal/backlog work

---

## Integration with Dashboard

The APR Dashboard can set priority when creating ClickUp tasks:

```typescript
// In dashboard form submission
const priority = calculatePriority({
  deliveryDate: job.delivery_date,
  isUrgent: job.is_urgent,
  clientTier: job.client_tier,
  propertyComplexity: job.property_complexity
})

// Pass to Edge Function
await createClickUpTask(jobId, { priority })
```

---

**Document Status:** ✅ Priority Reference Complete  
**Next Step:** Update Edge Function to use priority values when creating tasks
