# File Upload & Preview Testing Requirements

**Last Updated**: September 30, 2025
**Status**: 🚨 CRITICAL - Lost features after file deletion incident

## 🎯 What We Lost

**Before the crash** (when files were accidentally deleted):
- ✅ Beautiful image previewer with zoom in/out
- ✅ Smooth zoom controls (similar to LOE Preview Modal)
- ✅ Click-to-open file viewer
- ✅ Professional UX with animations

**Current State**:
- ❌ Basic preview (opens in new tab via `window.open()`)
- ❌ No in-app file viewer
- ❌ No zoom controls for uploaded documents
- ❌ Lost sophisticated file preview system

## 📋 Testing Requirements

### Priority 1: Supabase Storage Buckets

**Critical Test**: Verify files upload to correct Supabase buckets

**Current Bucket Configuration**:
- **Bucket Name**: `job-files` (confirmed Sept 12, 2025 - see archived FIX_UPLOADS_INSTRUCTIONS.md)
- **Storage URL**: `https://ngovnamnjmexdpjtcnky.supabase.co/storage/v1/object/public/job-files/`
- **RLS Policies**: Public read/insert/update/delete (for testing - should be restricted for production)

**Test Checklist**:
- [ ] Client submission form files → Go to `job-files` bucket
- [ ] Section 4 document uploads → Go to `job-files` bucket
- [ ] Check Supabase dashboard to verify files appear in correct location
- [ ] Test file retrieval: Click uploaded file → Should load from Supabase
- [ ] Test file deletion: Remove file → Should delete from Supabase bucket
- [ ] Verify file URLs are using correct bucket path

**Common Issues to Watch**:
- Bucket name mismatch (`job-files` vs `job-documents` confusion - fixed Sept 12)
- Missing RLS policies preventing uploads
- CORS errors preventing file access
- File paths not including job_id or proper folder structure

### Priority 2: File Preview System Restoration

**Goal**: Restore the lost image previewer with zoom functionality

**Reference Implementation**:
- `/src/components/dashboard/job-details/actions/LOEPreviewModal.tsx` - Has working zoom controls
- Zoom range: 25% to 200% in 10% increments
- Smooth zoom transitions with proper CSS transform/scale
- Reset zoom button (default 75-100%)

**Test Checklist**:
- [ ] Create/restore FilePreviewModal component
- [ ] Test with images (JPG, PNG, GIF, WebP)
- [ ] Test zoom in/out buttons (10% increments)
- [ ] Test zoom reset button
- [ ] Test pan/drag when zoomed in
- [ ] Test with PDF files (page navigation)
- [ ] Test loading states (spinner while loading)
- [ ] Test error states (file not found, corrupted)

**Expected Behavior**:
```
User clicks uploaded image → Opens in-app modal
Modal shows:
- Image at readable size (75-100% zoom)
- Zoom controls: [−] 75% [+] [Reset]
- Pan/drag when zoomed in
- Close button [×]
- Download button
- Smooth animations
```

### Priority 3: Smart Links Integration

**Status**: ✅ Smart links already implemented (see SMART-LINKS-INTEGRATION.md)

**Test Checklist**:
- [ ] Section 4: All document types show external link icon (↗️)
- [ ] Calgary properties: Links to SPIN2, Assessment Search, GIS, etc.
- [ ] Edmonton properties: Links to Edmonton portals
- [ ] Saskatoon properties: Links to Saskatoon portals
- [ ] Address pre-fills correctly in external sites
- [ ] Links open in new tab (don't lose APR Dashboard context)

**Smart Link Types**:
1. Land Title (Alberta SPIN2)
2. Assessment Search
3. Zoning Maps
4. Flood Maps
5. Aerial/Satellite (Google Maps)
6. Building Permits Portal
7. Tax Notice Portal

### Priority 4: File Management Workflow

**Complete User Flow**:
```
1. User clicks smart link (↗️) → Opens government site
2. User downloads document → Saves to computer
3. User uploads via APR Dashboard → File goes to Supabase
4. User clicks uploaded file → Opens in-app preview with zoom
5. User can download, delete, or replace file
```

**Test Each Step**:
- [ ] Smart link opens correct site with address
- [ ] Upload button accepts correct file types
- [ ] Upload progress shows while uploading
- [ ] File appears in list after successful upload
- [ ] Click file → Opens preview (not new tab)
- [ ] Preview has zoom controls (if image/PDF)
- [ ] Download button retrieves from Supabase
- [ ] Delete button removes from Supabase bucket

### Priority 5: File Organization by Job

**Folder Structure Test**:
```
Supabase Storage: job-files/
├── job_[JOB_ID]/
│   ├── land_title.pdf
│   ├── assessment.pdf
│   ├── zoning_map.png
│   └── aerial_photo.jpg
```

**Test Checklist**:
- [ ] Files organized by job_id folder
- [ ] Multiple jobs don't conflict (files in separate folders)
- [ ] File names preserved or renamed systematically
- [ ] Can retrieve files by job_id + filename
- [ ] Deleting job doesn't leave orphaned files

### Priority 6: File Type Support

**Supported Types** (from README.md):
1. **Images**: JPG, JPEG, PNG, GIF, BMP, WebP, HEIC
2. **Documents**: PDF
3. **Spreadsheets**: Excel (view only)
4. **Text**: Word documents (view only)

**Test Matrix**:
| File Type | Upload | Preview | Zoom | Download |
|-----------|--------|---------|------|----------|
| JPG       | [ ]    | [ ]     | [ ]  | [ ]      |
| PNG       | [ ]    | [ ]     | [ ]  | [ ]      |
| PDF       | [ ]    | [ ]     | [ ]  | [ ]      |
| Excel     | [ ]    | [ ]     | N/A  | [ ]      |
| Word      | [ ]    | [ ]     | N/A  | [ ]      |

## 🔧 Implementation Components

### Current Status (from README.md):
- ✅ Base FilePreviewModal component created (November 2024)
- ✅ Zoom implementation copied from LOE Preview Modal
- ✅ File type detection implemented
- ❌ NOT integrated into main app yet
- ❌ Dependencies NOT installed
- ❌ Preview buttons still use `window.open()`

### To Complete Integration:
1. Install required dependencies:
   ```json
   {
     "@react-pdf-viewer/core": "^3.x",
     "react-pdf": "^7.x",
     "pdfjs-dist": "^3.x",
     "react-zoom-pan-pinch": "^3.x",
     "react-use": "^17.x"
   }
   ```

2. Update Section4Compact.tsx:
   - Replace `window.open(url)` with `openFilePreview(file)`
   - Wire up FilePreviewModal component
   - Add preview button with eye icon

3. Update UploadedDocumentsSection.tsx:
   - Same preview modal integration
   - Consistent UX across all file uploads

4. Test complete workflow with real Supabase files

## 🚨 Known Issues & Fixes

### Issue 1: Bucket Name Confusion (FIXED Sept 12)
**Problem**: Code used both `job-files` and `job-documents`
**Fix**: Standardized on `job-files` everywhere
**Reference**: Archived `/99-Archive/2025-09-30-Integration-Testing-Archive/FIX_UPLOADS_INSTRUCTIONS.md`

### Issue 2: Lost File Previewer
**Problem**: Accidentally deleted sophisticated preview system
**Impact**: Users see basic preview instead of professional zoom viewer
**Fix Needed**: Restore FilePreviewModal integration (components exist, just not wired up)

### Issue 3: Missing Dependencies
**Problem**: Preview components need external libraries
**Impact**: Can't use react-pdf or zoom controls
**Fix Needed**: Install dependencies listed above

## 📊 Success Criteria

**File Upload System is considered "working" when**:
1. ✅ All files upload to correct Supabase bucket (`job-files`)
2. ✅ Files organized by job_id in separate folders
3. ✅ Click file → Opens in-app preview (not new tab)
4. ✅ Image preview has zoom controls (25%-200%)
5. ✅ PDF preview has page navigation
6. ✅ Smart links work for all supported cities
7. ✅ Download/delete operations work correctly
8. ✅ No orphaned files in Supabase
9. ✅ Mobile responsive (appraisers work in field)
10. ✅ Loading/error states handled gracefully

## 🔗 Related Documentation

- **File Preview System**: `/04-FileManagement/README.md` (comprehensive plan)
- **Smart Links**: `/04-FileManagement/SMART-LINKS-INTEGRATION.md` (already working)
- **Implementation Plan**: `/04-FileManagement/IMPLEMENTATION-PLAN.md` (detailed steps)
- **LOE Preview Reference**: `/src/components/dashboard/job-details/actions/LOEPreviewModal.tsx` (zoom code)

## 🎯 Next Steps for Agent

**When asked to test or fix file uploads**:

1. **First**: Verify Supabase bucket configuration
   - Check bucket name is `job-files`
   - Check RLS policies allow upload/read
   - Test with one file upload

2. **Second**: Check if files are reaching Supabase
   - Upload a test file
   - Check Supabase dashboard
   - Verify file appears in `job-files/job_[ID]/`

3. **Third**: Test file retrieval
   - Click uploaded file in UI
   - Check console for URL being used
   - Verify URL points to correct bucket

4. **Fourth**: If preview broken
   - Check if FilePreviewModal exists
   - Check if dependencies installed
   - Wire up preview modal if components exist

5. **Fifth**: Restore zoom functionality
   - Reference LOEPreviewModal.tsx for working code
   - Copy zoom state management
   - Test zoom in/out/reset buttons

## 💡 Ben's Notes

> "Before our app crashed, we had a really nice image previewer for any of the documents that were uploaded, enabling the user to click on the image and it opens up in a nice file previewer. That has a zoom and zoom back effect and it was super cool. But when you and I were moving some files, we deleted part of our fucking app and I lost a lot of those really cool features."

**Key Takeaway**: The file preview system was WORKING before. Components likely still exist but aren't integrated. Don't rebuild from scratch - find what's already there and reconnect it.

---

**AGENTS: Don't assume the preview system needs to be built. It was built, then disconnected. Find the components and wire them back up.**