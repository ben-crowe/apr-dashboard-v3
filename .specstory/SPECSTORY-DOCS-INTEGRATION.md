# SpecStory + `/docs/` Integration Workflow

**Understanding how SpecStory feature overviews integrate with detailed documentation in `/docs/`**

---

## 🎯 The Hybrid Approach

You've set up a **hybrid documentation system** where:

1. **Detailed docs stay in `/docs/`** - Comprehensive documentation, specs, planning
2. **Feature overviews in `.specstory/features/`** - AI-referenceable summaries that link to `/docs/`
3. **Conversation history in `.specstory/history/`** - Auto-captured Cursor conversations

**They work together, not separately.**

---

## 📊 How It Works

### The Three-Layer System

```
┌─────────────────────────────────────────┐
│  Layer 1: Conversation History          │
│  .specstory/history/                    │
│  (Auto-captured Cursor conversations)   │
└──────────────┬──────────────────────────┘
               │ References
               ▼
┌─────────────────────────────────────────┐
│  Layer 2: Feature Overviews             │
│  .specstory/features/                  │
│  (AI-referenceable summaries)           │
│  - Links to /docs/                      │
│  - Referenceable via @ mentions         │
└──────────────┬──────────────────────────┘
               │ Links to
               ▼
┌─────────────────────────────────────────┐
│  Layer 3: Detailed Documentation       │
│  /docs/                                 │
│  (Comprehensive manual documentation)   │
│  - Feature specs                        │
│  - Architecture details                 │
│  - Planning docs                        │
└─────────────────────────────────────────┘
```

---

## 🔄 The Workflow

### Step 1: Write Detailed Docs in `/docs/`

**You continue writing comprehensive documentation in `/docs/`** as you did yesterday.

**Example:**
```
/docs/16-Field-Input-Output-Mapping/
├─ 01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md  (Detailed doc)
├─ 02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md
├─ README.md
└─ ...
```

**This is where you:**
- Write detailed specifications
- Document architecture decisions
- Create planning documents
- Write comprehensive guides

### Step 2: Create Feature Overview in SpecStory

**After writing detailed docs, create a feature overview** that references them.

**Example:**
```
.specstory/features/field-input-output-mapping-feature-overview.md
```

**This overview:**
- Provides high-level summary
- Links to detailed docs in `/docs/`
- Is referenceable in Cursor via `@` mentions
- Gives AI quick context

**The overview references `/docs/`:**
```markdown
## Related Documentation

- **Phase 15 Field Registry**: `docs/15-Contract-review/...`
- **Income Approach Map**: `docs/16-Field-Input-Output-Mapping/01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`
- **Passover Session**: `docs/16-Field-Input-Output-Mapping/00-PASSOVER-SESSION.md`
```

### Step 3: Use in Cursor Conversations

**When chatting with Cursor, reference the feature overview:**

```
@.specstory/features/field-input-output-mapping-feature-overview.md

Can you help me complete the Sales Comparison mapping?
```

**Cursor will:**
- Load the feature overview context
- See links to detailed docs in `/docs/`
- Understand the architecture
- Reference the detailed docs when needed

---

## ✅ What You Should Do

### ✅ **Continue Writing in `/docs/`**

**This is correct!** Keep writing detailed documentation in `/docs/` as you did yesterday.

**Why:**
- Detailed specs belong there
- Team knowledge base
- Comprehensive documentation
- Planning documents

### ✅ **Create Feature Overviews After**

**After completing a major feature or phase, create a feature overview:**

```
Ask Cursor: "Create a feature overview for Phase 16 Field Input-Output Mapping. 
Reference the detailed docs in docs/16-Field-Input-Output-Mapping/ and create 
a comprehensive overview in SpecStory format."
```

**The overview should:**
- Summarize the feature
- Link to detailed docs in `/docs/`
- Be referenceable via `@` mentions
- Provide quick context for AI

### ✅ **Update Overviews When Docs Change**

**When you update docs in `/docs/`, update the feature overview:**

```
Ask Cursor: "Update the field-input-output-mapping feature overview to reflect 
the new Sales Comparison mapping that was completed in docs/16-Field-Input-Output-Mapping/02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md"
```

---

## 📝 Example: Phase 16 Field Mapping

### What You Did (Correct!)

1. **Wrote detailed docs in `/docs/`:**
   ```
   /docs/16-Field-Input-Output-Mapping/
   ├─ 01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md  ✅ Detailed
   ├─ 02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md ✅ Detailed
   └─ ...
   ```

2. **Created feature overview:**
   ```
   .specstory/features/field-input-output-mapping-feature-overview.md
   ```
   - References `/docs/16-Field-Input-Output-Mapping/`
   - Links to detailed docs
   - Referenceable via `@` mentions

3. **Integration:**
   - Overview links to `/docs/`
   - Detailed docs stay in `/docs/`
   - Both work together

---

## 🚨 Common Misconceptions

### ❌ **"Move all docs to SpecStory"**

**Wrong!** Detailed docs stay in `/docs/`. SpecStory feature overviews are summaries that link to them.

### ❌ **"SpecStory replaces `/docs/`"**

**Wrong!** They serve different purposes:
- `/docs/` = Detailed documentation
- `.specstory/features/` = AI-referenceable summaries
- `.specstory/history/` = Conversation history

### ✅ **"SpecStory overviews reference `/docs/`"**

**Correct!** Feature overviews link to and reference detailed docs in `/docs/`.

---

## 🎯 Best Practices

### 1. **Write Detailed Docs First**

**Always write comprehensive documentation in `/docs/` first.**

**Then** create a feature overview that references it.

### 2. **Feature Overviews Are Summaries**

**Feature overviews should:**
- Provide high-level summary
- Link to detailed docs
- Be referenceable in Cursor
- Give quick context

**They should NOT:**
- Duplicate all content from `/docs/`
- Replace detailed documentation
- Be the only documentation

### 3. **Keep Them Linked**

**Always link feature overviews to `/docs/`:**

```markdown
## Related Documentation

- **Detailed Income Approach Map**: `docs/16-Field-Input-Output-Mapping/01-INCOME-APPROACH-INPUT-OUTPUT-MAP.md`
- **Sales Comparison Map**: `docs/16-Field-Input-Output-Mapping/02-SALES-COMPARISON-INPUT-OUTPUT-MAP.md`
- **Phase Overview**: `docs/16-Field-Input-Output-Mapping/README.md`
```

### 4. **Update Both When Needed**

**When updating `/docs/`:**
- Update the feature overview if it's a major change
- Keep links current
- Update "Last Updated" dates

---

## 🔍 Why SpecStory Stopped Capturing

### The Real Answer:

**SpecStory captures Cursor conversations automatically.**

**If you were:**
- ✅ Writing docs in `/docs/` manually → **No capture** (this is correct!)
- ✅ Having Cursor conversations → **Should capture** (check extension)

**SpecStory feature overviews are created manually** (by asking Cursor to create them), not auto-captured.

**Conversation history** (`.specstory/history/`) is auto-captured when you chat with Cursor.

---

## 📋 Summary

### ✅ **What You Should Do:**

1. **Continue writing detailed docs in `/docs/`** ✅ (You're doing this correctly!)
2. **Create feature overviews in `.specstory/features/`** that reference `/docs/`
3. **Link overviews to detailed docs** via "Related Documentation" section
4. **Reference overviews in Cursor** via `@` mentions

### ❌ **What You Should NOT Do:**

1. ❌ Move all docs to SpecStory
2. ❌ Duplicate content in both places
3. ❌ Replace `/docs/` with SpecStory
4. ❌ Expect SpecStory to auto-capture manual doc writing

### 🎯 **The System:**

- **`/docs/`** = Detailed documentation (manual writing) ✅
- **`.specstory/features/`** = AI-referenceable summaries (link to `/docs/`) ✅
- **`.specstory/history/`** = Auto-captured conversations ✅

**They all work together!**

---

**Last Updated**: 2026-01-09  
**Status**: Active - Hybrid documentation system working as designed
