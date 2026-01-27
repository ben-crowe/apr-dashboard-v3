# LOE Template Management Enhancement Plan

**Created:** January 20, 2026  
**Purpose:** Enhance template editor with "Save As", template selection, and persistent template management  
**Status:** Planning Phase

---

## Current Implementation

### ✅ What Works Now

1. **Template Saving**
   - Saves to `loe_templates` table in Supabase
   - Includes: name, template_html, is_default, created_by
   - Supports multiple templates per user

2. **Template Loading**
   - Automatically loads user's default template when generating LOE
   - Falls back to embedded `V3_TEMPLATE` if no default exists
   - Function: `loadV3Template(userId)` in `generateLOE.ts`

3. **Save Dialog**
   - Template name input
   - "Set as default" checkbox
   - Saves as new template (always inserts)

### ❌ What's Missing

1. **"Save As" Functionality**
   - Currently only creates NEW templates
   - No way to save a copy with different name
   - No way to update existing template

2. **Template Selection**
   - No UI to choose from saved templates
   - No dropdown/list of user's templates
   - Can't switch between templates

3. **Template Management**
   - Can't see list of saved templates
   - Can't edit existing template
   - Can't delete templates
   - Can't rename templates

---

## Proposed Solution

### Phase 1: Template Selection UI

**Add template dropdown/selector in TemplateEditorModal**

**Location:** `TemplateEditorModal.tsx`

**Features:**
1. **Template Selector Dropdown**
   - Shows list of user's saved templates
   - Shows current template name
   - "Load Template" button to switch
   - "New Template" option to start fresh

2. **Template Loading**
   - Fetch user's templates on modal open
   - Display template name, created date
   - Load selected template into editor

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ Edit LOE Template                    [X]│
├─────────────────────────────────────────┤
│ Template: [Standard LOE ▼]  [Load]     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Editor Panel (left)                 │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Preview Panel (right)                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Save Template] [Cancel]                │
└─────────────────────────────────────────┘
```

### Phase 2: Enhanced Save Dialog

**Upgrade save dialog with "Save As" options**

**Features:**
1. **Save Options**
   - **Save** - Update current template (if editing existing)
   - **Save As** - Create new template with new name
   - **Save Copy** - Duplicate current template

2. **Template Selection in Save Dialog**
   - Dropdown: "Save to existing template" or "Create new template"
   - If "existing": Show list of templates
   - If "new": Show name input

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ Save Template                           │
├─────────────────────────────────────────┤
│ Save as:                                │
│ ○ New Template                          │
│   Name: [________________]              │
│                                         │
│ ○ Existing Template                     │
│   Template: [Standard LOE ▼]           │
│                                         │
│ ☑ Set as my default template           │
│                                         │
│ [Save] [Cancel]                         │
└─────────────────────────────────────────┘
```

### Phase 3: Template Management

**Add template list/management UI**

**Features:**
1. **Template List View**
   - Show all user's templates
   - Display: name, created date, is_default badge
   - Actions: Edit, Delete, Set Default, Duplicate

2. **Template Actions**
   - **Edit** - Open template in editor
   - **Delete** - Remove template (with confirmation)
   - **Set Default** - Make this the default template
   - **Duplicate** - Create copy with new name

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ My Templates                            │
├─────────────────────────────────────────┤
│ Standard LOE          [Default]         │
│ Created: Jan 15, 2026                   │
│ [Edit] [Duplicate] [Delete]            │
│                                         │
│ Commercial LOE                          │
│ Created: Jan 10, 2026                   │
│ [Edit] [Set Default] [Duplicate] [Delete]│
│                                         │
│ [New Template] [Close]                  │
└─────────────────────────────────────────┘
```

---

## Implementation Plan

### Step 1: Create Template Loading Utility

**File:** `src/utils/loe/loadTemplates.ts`

```typescript
export interface LOETemplate {
  id: string;
  name: string;
  template_html: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export async function loadUserTemplates(userId: string): Promise<LOETemplate[]> {
  const { data, error } = await supabase
    .from('loe_templates')
    .select('*')
    .eq('created_by', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function loadTemplateById(templateId: string, userId: string): Promise<LOETemplate | null> {
  const { data, error } = await supabase
    .from('loe_templates')
    .select('*')
    .eq('id', templateId)
    .eq('created_by', userId)
    .single();

  if (error) return null;
  return data;
}
```

### Step 2: Update saveTemplate Utility

**File:** `src/utils/loe/saveTemplate.ts`

**Add update functionality:**

```typescript
export async function updateTemplate({
  templateId,
  templateHTML,
  setAsDefault,
  userId
}: {
  templateId: string;
  templateHTML: string;
  setAsDefault: boolean;
  userId: string;
}): Promise<SaveTemplateResult> {
  // Update existing template
  // If setAsDefault, unset other defaults first
  // Update updated_at timestamp
}

export async function duplicateTemplate({
  templateId,
  newName,
  userId
}: {
  templateId: string;
  newName: string;
  userId: string;
}): Promise<SaveTemplateResult> {
  // Load template
  // Create new template with new name
  // Copy template_html
}
```

### Step 3: Add Template Selector to TemplateEditorModal

**File:** `src/components/dashboard/job-details/actions/TemplateEditorModal.tsx`

**Add:**
1. State for templates list
2. State for selected template
3. Fetch templates on modal open
4. Template dropdown UI
5. Load template functionality

### Step 4: Enhance Save Dialog

**Update save dialog to support:**
1. Radio buttons: "New Template" vs "Existing Template"
2. Conditional UI based on selection
3. Template dropdown if "Existing Template"
4. Update vs Insert logic

### Step 5: Add Template Management Modal (Optional)

**File:** `src/components/dashboard/job-details/actions/TemplateManagementModal.tsx`

**New component for:**
- Listing all templates
- Template actions (Edit, Delete, Set Default, Duplicate)
- Template creation

---

## Database Schema (Already Exists)

```sql
CREATE TABLE loe_templates (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  template_html TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Note:** Schema already supports all needed features!

---

## User Flow Examples

### Flow 1: Create New Template

1. User clicks "Edit Template"
2. Makes edits
3. Clicks "Save Template"
4. Save dialog opens
5. Selects "New Template"
6. Enters name: "Commercial LOE"
7. Checks "Set as default"
8. Clicks "Save"
9. ✅ Template saved, becomes default

### Flow 2: Update Existing Template

1. User clicks "Edit Template"
2. Template selector shows "Standard LOE" (current)
3. Makes edits
4. Clicks "Save Template"
5. Save dialog opens
6. Selects "Existing Template"
7. Chooses "Standard LOE" from dropdown
8. Clicks "Save"
9. ✅ Template updated (not duplicated)

### Flow 3: Save As New Template

1. User clicks "Edit Template"
2. Currently editing "Standard LOE"
3. Makes edits
4. Clicks "Save Template"
5. Save dialog opens
6. Selects "New Template"
7. Enters name: "Standard LOE v2"
8. Clicks "Save"
9. ✅ New template created, original unchanged

### Flow 4: Load Different Template

1. User clicks "Edit Template"
2. Template selector shows current template
3. Clicks dropdown, sees:
   - Standard LOE (default)
   - Commercial LOE
   - Residential LOE
4. Selects "Commercial LOE"
5. Clicks "Load Template"
6. ✅ Editor loads Commercial LOE template
7. Can edit and save

---

## Implementation Priority

### 🔴 High Priority (Core Functionality)

1. **Template Selection Dropdown** - Users need to choose templates
2. **Enhanced Save Dialog** - "Save As" vs "Update" options
3. **Update Template Function** - Save changes to existing template

### 🟡 Medium Priority (Better UX)

4. **Template Loading** - Fetch and display user's templates
5. **Template List View** - See all templates in one place
6. **Duplicate Template** - Copy existing template

### 🟢 Low Priority (Nice to Have)

7. **Template Management Modal** - Full CRUD interface
8. **Template Preview** - Thumbnail/preview of templates
9. **Template Versioning** - Track template versions

---

## Questions to Consider

1. **Default Behavior:**
   - When user edits template, should it auto-select "Update" or "Save As"?
   - Should we track "original template" vs "edited version"?

2. **Template Naming:**
   - Allow duplicate names? (with version numbers?)
   - Auto-generate names? ("Template 1", "Template 2")

3. **Template Deletion:**
   - What if user deletes default template?
   - Auto-select new default or require manual selection?

4. **Template Sharing:**
   - Should templates be user-specific only?
   - Or allow sharing between users? (future feature)

5. **Template Validation:**
   - Validate template HTML before saving?
   - Check for required placeholders?

---

## Next Steps

1. **Review this plan** - Confirm approach and priorities
2. **Implement Phase 1** - Template selection dropdown
3. **Implement Phase 2** - Enhanced save dialog
4. **Test with real templates** - Verify persistence and loading
5. **Add Phase 3** - Template management UI (if needed)

---

**Last Updated:** January 20, 2026  
**Related Files:**
- `src/utils/loe/saveTemplate.ts`
- `src/utils/loe/generateLOE.ts`
- `src/components/dashboard/job-details/actions/TemplateEditorModal.tsx`
- `supabase/migrations/20260120124531_create_loe_templates.sql`
