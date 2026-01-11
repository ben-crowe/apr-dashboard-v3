# SpecStory Capture - What It Does & Why It Stopped

**Understanding what SpecStory captures and troubleshooting why it stopped**

---

## 🎯 What SpecStory Actually Captures

### ✅ **SpecStory Captures:**
- **Cursor AI conversations** (chat/composer sessions)
- **Only when you're chatting with Cursor AI** in the Cursor IDE
- **Automatic capture** when SpecStory extension is installed and active

### ❌ **SpecStory Does NOT Capture:**
- Manual file edits (typing code yourself)
- Documentation written in `/docs` folder
- Work done in other editors (VS Code, Sublime, etc.)
- Terminal commands (unless part of a Cursor conversation)
- Git commits (unless discussed in Cursor chat)

---

## 🔍 Why It Stopped Capturing on Jan 8th

### Possible Reasons:

1. **No Cursor Conversations Since Jan 8**
   - If you haven't chatted with Cursor AI since then, nothing gets captured
   - SpecStory only captures **conversations**, not manual work

2. **Working in Different Editor**
   - If you're writing docs in VS Code or another editor, SpecStory won't capture
   - SpecStory extension must be installed in **Cursor IDE**

3. **Extension Not Active**
   - SpecStory extension might be disabled
   - Extension might need to be reinstalled

4. **Wrong Workspace**
   - If you opened a different folder, SpecStory might not be configured there
   - Need to open `apr-dashboard-v3.code-workspace` file

---

## 📊 SpecStory vs. Manual Documentation

### **SpecStory** (`.specstory/`)
- **Purpose**: Conversation history with Cursor AI
- **Captures**: What you asked, what AI suggested, code changes made via AI
- **Use Case**: Reference past AI conversations, understand how features were built
- **Location**: `.specstory/history/` and `.specstory/features/`

### **Manual Documentation** (`/docs/`)
- **Purpose**: Project documentation, specs, guides
- **Captures**: Manual writing, planning documents, feature specs
- **Use Case**: Project documentation, team knowledge base
- **Location**: `/docs/` folder

### **They Work Together:**

```
┌─────────────────────────────────────┐
│  Cursor AI Conversation             │
│  (You + AI discussing feature)      │
│         ↓                           │
│  SpecStory Captures                 │
│  (Auto-saved to .specstory/history) │
│         ↓                           │
│  You Implement Feature              │
│  (Manual coding/documentation)      │
│         ↓                           │
│  Write Docs in /docs/               │
│  (Manual documentation)              │
│         ↓                           │
│  Create Feature Overview            │
│  (In .specstory/features/)          │
└─────────────────────────────────────┘
```

---

## 🔧 How to Ensure SpecStory Captures

### Step 1: Verify Extension is Installed

**In Cursor IDE:**
1. Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows)
2. Search: `SpecStory`
3. Should see: "SpecStory - AI Chat History" by SpecStory
4. If not installed → Click "Install"

### Step 2: Verify Workspace is Correct

**Open the workspace file:**
```bash
# In Cursor IDE:
File → Open Workspace from File...
Select: apr-dashboard-v3.code-workspace
```

**Or from terminal:**
```bash
cd /Users/bencrowe/Development/apr-dashboard-v3
cursor apr-dashboard-v3.code-workspace
```

### Step 3: Verify Settings

**Check workspace settings:**
```json
// apr-dashboard-v3.code-workspace should have:
{
  "settings": {
    "specstory.enabled": true,
    "specstory.autoSave": true
  }
}
```

### Step 4: Test Capture

**Start a conversation:**
1. Press `Cmd+L` (Mac) or `Ctrl+L` (Windows) to open Cursor chat
2. Ask a simple question: "What files are in the src directory?"
3. Wait for response
4. Check if session was captured:
   ```bash
   cd .specstory
   ./specstory-utils.sh latest 1
   ```

---

## 📝 When to Use SpecStory vs. `/docs/`

### Use **SpecStory** for:
- ✅ Capturing AI conversations automatically
- ✅ Reference past AI discussions
- ✅ Feature overviews (`.specstory/features/`)
- ✅ Understanding how features were built
- ✅ Finding past solutions to problems

### Use **`/docs/`** for:
- ✅ Manual project documentation
- ✅ Feature specifications
- ✅ Architecture diagrams
- ✅ Team knowledge base
- ✅ Planning documents
- ✅ Detailed technical docs

### **Best Practice:**
1. **Have conversations in Cursor** → SpecStory auto-captures
2. **Write detailed docs in `/docs/`** → Manual documentation
3. **Create feature overviews** → `.specstory/features/` (referenceable in Cursor)
4. **Link them together** → Reference SpecStory sessions in `/docs/` files

---

## 🚨 Troubleshooting: Why No Captures Since Jan 8

### Check 1: Are You Using Cursor IDE?

**If you're using:**
- ✅ **Cursor IDE** → SpecStory should capture
- ❌ **VS Code** → SpecStory won't capture (different extension)
- ❌ **Other editors** → SpecStory won't capture

### Check 2: Are You Having Conversations?

**SpecStory only captures when:**
- You open Cursor chat (`Cmd+L` or `Ctrl+L`)
- You ask questions or give instructions
- AI responds and makes changes

**If you're just:**
- Editing files manually → No capture
- Writing docs in `/docs/` → No capture
- Using terminal → No capture (unless part of conversation)

### Check 3: Extension Status

**Verify extension:**
```bash
# In Cursor IDE terminal:
code --list-extensions | grep -i specstory
```

**Should show:**
```
specstory.specstory
```

**If not found:**
- Install SpecStory extension
- Reload Cursor window

### Check 4: Workspace Configuration

**Verify workspace file:**
```bash
cat apr-dashboard-v3.code-workspace | grep specstory
```

**Should show:**
```json
"specstory.enabled": true,
"specstory.autoSave": true
```

---

## 💡 Recommended Workflow

### **For Development Work:**

1. **Start conversation in Cursor:**
   ```
   Press Cmd+L (Mac) or Ctrl+L (Windows)
   Ask: "Help me implement feature X"
   ```

2. **SpecStory auto-captures:**
   - Conversation saved to `.specstory/history/`
   - Can reference later: `@.specstory/history/session-name.md`

3. **Write detailed docs in `/docs/`:**
   - Manual documentation
   - Feature specs
   - Architecture diagrams

4. **Create feature overview:**
   ```
   Ask Cursor: "Create a feature overview for X in SpecStory"
   ```
   - Saves to `.specstory/features/`
   - Referenceable: `@.specstory/features/feature-name.md`

### **For Documentation Work:**

1. **Write in `/docs/`** (manual)
2. **Reference SpecStory sessions** if relevant:
   ```markdown
   See SpecStory session: @.specstory/history/2026-01-08_session.md
   ```
3. **Create feature overview** if it's a major feature:
   ```
   Ask Cursor: "Create feature overview for [feature]"
   ```

---

## ✅ Quick Test: Is SpecStory Working?

**Right now, test it:**

1. **Open Cursor IDE** (not VS Code)
2. **Open workspace**: `apr-dashboard-v3.code-workspace`
3. **Press `Cmd+L`** (Mac) or `Ctrl+L` (Windows)
4. **Ask**: "What is the current date?"
5. **Wait for response**
6. **Check capture**:
   ```bash
   cd .specstory
   ./specstory-utils.sh latest 1
   ```

**If you see a new session** → ✅ SpecStory is working!  
**If no new session** → ❌ Check extension/workspace settings

---

## 🎯 Summary

**SpecStory captures:**
- ✅ Cursor AI conversations (automatic)
- ✅ Only when chatting with Cursor AI
- ✅ Only when extension is installed and active

**SpecStory does NOT capture:**
- ❌ Manual file edits
- ❌ Documentation in `/docs/`
- ❌ Work in other editors
- ❌ Terminal commands (unless part of conversation)

**If it stopped capturing:**
1. Check if you're using Cursor IDE
2. Check if you're having conversations (not just editing files)
3. Verify extension is installed
4. Verify workspace is correct

**Best practice:**
- Use SpecStory for AI conversation history
- Use `/docs/` for manual documentation
- Create feature overviews in `.specstory/features/` for major features
- Link them together when relevant

---

**Last Updated**: 2026-01-09  
**Status**: Active - Check extension status if not capturing
