# SpecStory Quick Reference Card

## 🚀 Quick Commands

```bash
cd .specstory

# View latest sessions
./specstory-utils.sh latest 5

# Search for anything
./specstory-utils.sh search "your search term"

# Find sessions about a file
./specstory-utils.sh find-file "filename.tsx"

# Show statistics
./specstory-utils.sh stats

# View a session
./specstory-utils.sh show <filename>
```

## 📖 In Cursor AI

Reference past sessions:
```
@.specstory/history/2026-01-06_22-45Z-image-page-configurator-color-discrepancy.md
```

## 📊 Current Status

- ✅ **Active**: Capturing sessions automatically
- 📁 **10 sessions** captured (2.8MB)
- 📅 **Latest**: Today's conversation!

## 🎯 Common Tasks

**"How did we fix X?"**
```bash
./specstory-utils.sh search "X"
```

**"What files did we modify for feature Y?"**
```bash
./specstory-utils.sh find-topic "Y"
./specstory-utils.sh find-file "filename.tsx"
```

**"Show me what we discussed yesterday"**
```bash
ls history/ | grep "2026-01-07"
```

## 📚 Full Documentation

- **What is SpecStory?**: `.what-is-this.md`
- **Complete Guide**: `USAGE-GUIDE.md`
- **Project Info**: `.project.json`

---

*Last updated: 2026-01-08*
