# Feature Documentation Workflow with SpecStory

**How to create, update, and reference feature documentation in SpecStory**

---

## Overview

You can now create comprehensive feature documentation directly in SpecStory that:
- ✅ **Is searchable** via SpecStory utilities
- ✅ **Is referenceable** in Claude Code via `@` mentions
- ✅ **Tracks updates** over time
- ✅ **Preserves architectural decisions** for future reference

---

## Creating Feature Documentation

### Step 1: Ask Claude to Create Feature Doc

**Example Request**:
```
Can you create a feature overview for the [Feature Name]? 
Review the code in [path/to/feature] and create comprehensive 
documentation in SpecStory format.
```

### Step 2: Claude Creates the Doc

Claude will:
1. Review the feature code and related files
2. Analyze the architecture and data flow
3. Create a comprehensive feature document in `.specstory/features/`
4. Follow the template structure (see `TEMPLATE-feature-overview.md`)

### Step 3: Reference in Future Conversations

In Claude Code, reference the feature:
```
@.specstory/features/[feature-name]-feature-overview.md
```

Claude can now:
- Understand the feature architecture
- See implementation details
- Reference past decisions
- Maintain consistency when making updates

---

## Updating Feature Documentation

### When to Update

Update feature docs when:
- ✅ Feature architecture changes
- ✅ New components are added
- ✅ API integrations change
- ✅ Data flow is modified
- ✅ Known issues are resolved
- ✅ New capabilities are added

### How to Update

**Option 1: Ask Claude to Update**
```
Update the ClickUp Integration feature doc to reflect the new 
Stage 4 automation that was just implemented.
```

**Option 2: Manual Update**
1. Edit the file: `.specstory/features/[feature]-feature-overview.md`
2. Update "Last Updated" date
3. Add entry to "Update History" section
4. Update relevant sections

### Tracking Updates

Each update is tracked in the "Update History" section:
```markdown
### Update History

**2026-01-08**: Added Stage 4 automation details
**2026-01-08**: Created comprehensive feature overview
**2025-11-06**: Implemented 4-stage automation
```

---

## Using Feature Docs in Claude Code

### Reference a Feature

**In Claude Code Chat**:
```
@.specstory/features/clickup-integration-feature-overview.md

Can you help me add a new stage to this integration?
```

Claude will:
- Load the full feature context
- Understand the current architecture
- Suggest changes that maintain consistency
- Update the feature doc if requested

### Search Features

**Via Utility Script**:
```bash
cd .specstory

# List all features
./specstory-utils.sh features

# View a specific feature
./specstory-utils.sh feature clickup

# Search for features
./specstory-utils.sh search "clickup"
```

---

## Feature Doc Structure

Each feature document includes:

1. **Executive Summary** - High-level overview
2. **Architecture Overview** - System design and flow diagrams
3. **Implementation Details** - Component breakdown
4. **Data Flow** - Field mappings and transformations
5. **API Integration** - External API usage
6. **Testing** - Test scenarios and validation
7. **Configuration** - Environment variables and setup
8. **Known Issues** - Limitations and future enhancements
9. **Related Documentation** - Links to other docs

---

## Example Workflow

### Scenario: Adding a New Feature Stage

1. **Review Existing Feature**:
   ```
   @.specstory/features/clickup-integration-feature-overview.md
   
   I want to add Stage 5: Report Delivery. Can you review the 
   current architecture and suggest how to implement it?
   ```

2. **Claude Reviews & Suggests**:
   - Understands current 4-stage workflow
   - Suggests implementation approach
   - Maintains consistency with existing stages

3. **Implement the Feature**:
   - Code the new stage
   - Test it
   - Update the feature doc

4. **Update Documentation**:
   ```
   Update the ClickUp Integration feature doc to include Stage 5: 
   Report Delivery. Add it to the workflow, update the architecture 
   diagram, and add implementation details.
   ```

5. **Future Reference**:
   - Feature doc now includes Stage 5
   - Future conversations can reference it
   - Architecture decisions are preserved

---

## Benefits

### 1. Context Preservation
- Never lose architectural decisions
- Understand why features were built a certain way
- See evolution of features over time

### 2. AI Assistance
- Claude can reference feature docs for consistency
- Understands full context when making changes
- Maintains architectural patterns

### 3. Onboarding
- New developers can understand features quickly
- Comprehensive overviews in one place
- Links to related documentation

### 4. Searchability
- Search across all feature docs
- Find features by topic or component
- Track updates over time

### 5. Living Documentation
- Docs update as features evolve
- History of changes preserved
- Always current and accurate

---

## Quick Reference

### Create Feature Doc
```
Create a feature overview for [Feature Name]. Review [path] 
and document the architecture, implementation, and data flow.
```

### Update Feature Doc
```
Update [feature-name]-feature-overview.md to reflect [changes].
Add to update history and update relevant sections.
```

### Reference in Claude Code
```
@.specstory/features/[feature-name]-feature-overview.md
```

### List Features
```bash
cd .specstory && ./specstory-utils.sh features
```

### View Feature
```bash
cd .specstory && ./specstory-utils.sh feature [name]
```

---

## Template

Use `TEMPLATE-feature-overview.md` as a starting point for new feature docs. It includes all standard sections with placeholders.

---

**This workflow enables you to maintain comprehensive, searchable, AI-referenceable feature documentation that evolves with your codebase.**
