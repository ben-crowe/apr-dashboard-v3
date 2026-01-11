# SpecStory Feature Documentation

This directory contains feature overviews, architectural documentation, and specifications written in SpecStory format.

## Purpose

These documents serve as:
- **Feature References**: Comprehensive overviews of major features
- **Architecture Docs**: System design and component architecture
- **Living Documentation**: Updated as features evolve
- **AI Context**: Referenceable in Claude Code via `@` mentions

## Usage in Claude Code

Reference any feature document in your conversations:

```
@.specstory/features/clickup-integration-feature-overview.md
```

This loads the full context of that feature into your conversation, allowing Claude to:
- Understand the feature architecture
- See implementation details
- Reference past decisions
- Maintain consistency across updates

## Document Structure

Each feature document follows this structure:
1. **Executive Summary** - High-level overview
2. **Architecture Overview** - System design and flow
3. **Implementation Details** - Technical specifics
4. **Data Flow** - Field mappings and data transformations
5. **API Integration** - External API usage
6. **Testing** - Test scenarios and validation
7. **Configuration** - Environment variables and setup
8. **Known Issues** - Limitations and future enhancements
9. **Related Documentation** - Links to other docs

## Current Features Documented

- ✅ **ClickUp Integration** - 4-stage automation workflow
- 🔄 More features coming...

## Updating Feature Docs

When updating a feature:
1. Update the "Last Updated" date
2. Add entry to "Update History" section
3. Update relevant sections with new information
4. Keep architecture diagrams current
5. Document any breaking changes

## Benefits

1. **Context Preservation**: Never lose architectural decisions
2. **Onboarding**: New developers can understand features quickly
3. **AI Assistance**: Claude can reference these docs for consistency
4. **Searchability**: All docs searchable via SpecStory utilities
5. **Version Tracking**: See how features evolved over time

---

*For more information, see `.specstory/USAGE-GUIDE.md`*
