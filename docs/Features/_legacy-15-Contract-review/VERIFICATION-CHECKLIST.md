# Mock Report Builder - Verification Checklist

Use this checklist to verify the implementation is working correctly.

## Pre-Flight Checks

- [ ] Node modules installed: `npm install` completed successfully
- [ ] Zustand installed: Check `package.json` for `zustand`
- [ ] Build succeeds: Run `npm run build` with no errors
- [ ] Dev server starts: Run `npm run dev` successfully

## Route Access

- [ ] Navigate to `http://localhost:3000/mock-builder`
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools
- [ ] Split-screen layout appears

## Layout Verification

### Split Panels
- [ ] Two panels visible (Edit | Preview)
- [ ] Resize handle visible between panels
- [ ] Resize handle has grip icon
- [ ] Dragging handle resizes panels
- [ ] Panels maintain proportions
- [ ] Minimum sizes respected (can't make too small)
- [ ] Maximum sizes respected (can't make too large)

### Edit Panel
- [ ] Header displays "Edit Report"
- [ ] Subheader displays "Make changes to see live preview updates"
- [ ] Three tabs visible: Cover Info | Photos | Summary
- [ ] Active tab highlighted
- [ ] Tab content area visible
- [ ] Scrollable when content overflows

### Preview Panel
- [ ] Header displays "Live Preview" with file icon
- [ ] Subheader displays "Updates automatically as you edit"
- [ ] Preview content visible
- [ ] Preview shows styled HTML document

## Cover Info Tab Tests

### Initial State
- [ ] "Cover Info" tab is active by default
- [ ] Three fields visible:
  - [ ] Property Address
  - [ ] Client Name
  - [ ] Report Date

### Property Address Field
- [ ] Label reads "Property Address"
- [ ] Input field visible and enabled
- [ ] Contains default value: "123 Main Street, Calgary, AB T2P 1J9"
- [ ] Can click and edit text
- [ ] Preview updates after 300ms pause
- [ ] Preview shows new address in cover page

### Client Name Field
- [ ] Label reads "Client Name"
- [ ] Input field visible and enabled
- [ ] Contains default value: "John Smith"
- [ ] Can click and edit text
- [ ] Preview updates after 300ms pause
- [ ] Preview shows new client name in cover page

### Report Date Field
- [ ] Label reads "Report Date"
- [ ] Display field visible (muted background)
- [ ] Shows today's date in YYYY-MM-DD format
- [ ] Field is disabled (cannot edit)
- [ ] Shows formula hint: "(Current Date)"

## Photos Tab Tests

### Initial State
- [ ] Click "Photos" tab to switch
- [ ] Tab content switches smoothly
- [ ] "Property Photos" section visible
- [ ] Three default images displayed
- [ ] Each image shows:
  - [ ] Grip icon (draggable handle)
  - [ ] Thumbnail (16x16 size)
  - [ ] URL text (truncated if long)
  - [ ] X button (remove)

### Drag-and-Drop
- [ ] Hover over image item - cursor changes to move
- [ ] Click and drag first image
- [ ] Image shows reduced opacity while dragging
- [ ] Drag over second image position
- [ ] Images swap positions
- [ ] Release mouse button
- [ ] Image stays in new position
- [ ] Preview updates immediately
- [ ] Photo order in preview matches edit panel

### Add Image
- [ ] Input field visible at bottom
- [ ] Placeholder text: "Enter image URL"
- [ ] Plus (+) button visible
- [ ] Paste URL: `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400`
- [ ] Press Enter key
- [ ] New image appears in list
- [ ] Input field clears
- [ ] Preview updates with new image
- [ ] Photo count increases (verify in Summary tab)

### Remove Image
- [ ] Click X button on any image
- [ ] Image removed from list
- [ ] Preview updates immediately
- [ ] Photo count decreases (verify in Summary tab)
- [ ] Removing all images shows empty state message

### Empty State
- [ ] Remove all images
- [ ] Empty state message appears:
  - [ ] Text: "No images added yet. Add an image URL above to get started."
  - [ ] Styled with border and padding
  - [ ] Center aligned

## Summary Tab Tests

### Initial State
- [ ] Click "Summary" tab to switch
- [ ] Tab content switches smoothly
- [ ] Two fields visible:
  - [ ] Summary Notes
  - [ ] Total Photo Count

### Summary Notes Field
- [ ] Label reads "Summary Notes"
- [ ] Textarea visible (multiline)
- [ ] Contains default summary text
- [ ] Textarea expands to fit content
- [ ] Can click and edit text
- [ ] Can press Enter to create new lines
- [ ] Preview updates after 300ms pause
- [ ] Preview shows formatted summary text
- [ ] Line breaks preserved in preview

### Total Photo Count Field
- [ ] Label reads "Total Photo Count"
- [ ] Display field visible (muted background)
- [ ] Shows number: "3" (initially)
- [ ] Field is disabled (cannot edit)
- [ ] Shows formula hint: "(Count of property photos)"
- [ ] Count updates when images added/removed
- [ ] Verify by switching to Photos tab and adding/removing images

## Preview Panel Tests

### Initial Render
- [ ] Preview shows complete HTML document
- [ ] Document has white background
- [ ] Content is centered
- [ ] Proper spacing and padding

### Cover Page Section
- [ ] Title: "Appraisal Report"
- [ ] Property address displayed
- [ ] Client name displayed
- [ ] Report date displayed
- [ ] All text properly formatted
- [ ] Border line below cover section

### Photos Section
- [ ] Heading: "Property Photos"
- [ ] Photo grid layout visible
- [ ] All images displayed
- [ ] Images in same order as edit panel
- [ ] Each image:
  - [ ] Proper size (250px width)
  - [ ] Rounded corners
  - [ ] Border
  - [ ] Maintains aspect ratio
- [ ] Grid responds to number of images
- [ ] Empty state shown if no images

### Summary Section
- [ ] Heading: "Summary"
- [ ] Summary text displayed
- [ ] Text formatted in box with background
- [ ] Line breaks preserved
- [ ] Stat box displays: "Total Photos: X"
- [ ] Photo count matches actual count
- [ ] Empty state shown if no summary text

### Preview Updates
- [ ] Text changes appear after 300ms pause
- [ ] Image changes appear immediately
- [ ] No flickering during updates
- [ ] Smooth transitions
- [ ] Scroll position maintained

## Debouncing Tests

### Text Field Debouncing
- [ ] Type continuously in Property Address
- [ ] Preview does NOT update while typing
- [ ] Stop typing for 300ms
- [ ] Preview updates once after pause
- [ ] Type again immediately
- [ ] Previous update cancelled
- [ ] Preview waits for another 300ms pause

### Image Operation (No Debouncing)
- [ ] Drag and drop image
- [ ] Preview updates IMMEDIATELY
- [ ] No 300ms delay
- [ ] Add image
- [ ] Preview updates IMMEDIATELY
- [ ] Remove image
- [ ] Preview updates IMMEDIATELY

## Calculated Field Updates

### Report Date
- [ ] Always shows today's date
- [ ] Format: YYYY-MM-DD (e.g., 2025-12-04)
- [ ] Updates if page left open overnight (theoretical)

### Photo Count
- [ ] Initially shows "3"
- [ ] Add image in Photos tab
- [ ] Switch to Summary tab
- [ ] Count shows "4"
- [ ] Remove 2 images
- [ ] Count shows "2"
- [ ] Remove all images
- [ ] Count shows "0"
- [ ] Preview stat box matches count

## Tab Navigation Tests

- [ ] Click between tabs rapidly
- [ ] No errors in console
- [ ] Content switches smoothly
- [ ] Active tab always highlighted
- [ ] Previous tab content hidden
- [ ] Tab switch doesn't regenerate preview
- [ ] Only data changes regenerate preview

## Responsive Behavior

### Panel Resizing
- [ ] Resize to minimum Edit panel width
- [ ] Content still readable
- [ ] Preview panel takes remaining space
- [ ] Resize to maximum Edit panel width
- [ ] Preview panel respects minimum size
- [ ] Return to default sizes

### Content Scrolling
- [ ] Add many images (10+)
- [ ] Edit panel scrolls properly
- [ ] Tab bar stays fixed at top
- [ ] Preview panel independent scroll
- [ ] Both panels scroll independently

## Browser Console Tests

### Initial Load
- [ ] Open DevTools console
- [ ] No errors on page load
- [ ] No warnings (except build warnings)
- [ ] Zustand store initialized

### During Interaction
- [ ] Edit fields
- [ ] No errors while typing
- [ ] No errors when pausing
- [ ] Drag-drop images
- [ ] No errors during drag
- [ ] Switch tabs
- [ ] No errors during switch

### Network Tab
- [ ] Images load successfully
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] Unsplash images load

## Performance Tests

### Initial Load
- [ ] Page loads in < 2 seconds
- [ ] Preview renders in < 1 second
- [ ] No loading spinners (unless added)
- [ ] Smooth animation

### Interaction Performance
- [ ] Text editing feels responsive
- [ ] No lag while typing
- [ ] Preview update is smooth
- [ ] Drag-drop is smooth (60fps)
- [ ] Tab switching is instant
- [ ] No noticeable delay

### Memory Usage
- [ ] Open DevTools > Memory
- [ ] Take heap snapshot
- [ ] Interact with builder
- [ ] Take another snapshot
- [ ] Memory usage reasonable
- [ ] No major memory leaks

## Edge Cases

### Empty Values
- [ ] Clear Property Address completely
- [ ] Preview shows "Not specified"
- [ ] Clear Client Name
- [ ] Preview shows "Not specified"
- [ ] Clear Summary Notes
- [ ] Preview shows empty state message

### Invalid Image URLs
- [ ] Add invalid URL: "not-a-url"
- [ ] Image appears in list
- [ ] Preview shows broken image icon
- [ ] Can still remove image
- [ ] No console errors

### Long Text
- [ ] Paste very long address (500+ chars)
- [ ] Field accepts text
- [ ] Preview shows full text
- [ ] Layout not broken

### Special Characters
- [ ] Type special chars: `<script>alert('test')</script>`
- [ ] Preview renders safely (no script execution)
- [ ] HTML entities escaped
- [ ] No XSS vulnerability

### Rapid Actions
- [ ] Type rapidly in multiple fields
- [ ] Switch tabs rapidly
- [ ] Drag-drop images rapidly
- [ ] Add/remove images rapidly
- [ ] No errors or crashes
- [ ] Preview updates correctly

## TypeScript Tests

### Build Time
- [ ] Run `npm run build`
- [ ] No TypeScript errors
- [ ] No type warnings
- [ ] Strict mode passes

### IDE IntelliSense
- [ ] Open any component file
- [ ] Hover over variables
- [ ] Types appear correctly
- [ ] Auto-complete works
- [ ] No red squiggles (errors)

## Documentation Tests

- [ ] README exists
- [ ] Implementation docs exist
- [ ] Quick start guide exists
- [ ] Architecture diagram exists
- [ ] All links work
- [ ] Code examples correct

## Final Verification

### Functional Requirements
- [ ] Split-screen layout works
- [ ] 3 mock sections implemented
- [ ] Live preview updates
- [ ] Image drag-drop works
- [ ] 300ms debounce on text
- [ ] Calculated fields auto-update
- [ ] Tab navigation works

### Technical Requirements
- [ ] Zustand for state management
- [ ] shadcn/ui components used
- [ ] Resizable panels work
- [ ] Tabs component used
- [ ] iframe preview isolated
- [ ] Debounce implemented

### Code Quality
- [ ] TypeScript strict mode
- [ ] Proper type definitions
- [ ] Clean component structure
- [ ] Separation of concerns
- [ ] No console errors
- [ ] No warnings

### Documentation
- [ ] Implementation guide complete
- [ ] Quick start guide complete
- [ ] Architecture documented
- [ ] File structure documented
- [ ] Verification checklist complete

## Sign-Off

Date: ________________

Verified by: ________________

Notes:
_____________________________________________
_____________________________________________
_____________________________________________

## Issues Found

List any issues discovered during verification:

1. Issue: ________________
   Severity: [ ] Critical [ ] Major [ ] Minor
   Status: [ ] Fixed [ ] Open [ ] Won't Fix

2. Issue: ________________
   Severity: [ ] Critical [ ] Major [ ] Minor
   Status: [ ] Fixed [ ] Open [ ] Won't Fix

3. Issue: ________________
   Severity: [ ] Critical [ ] Major [ ] Minor
   Status: [ ] Fixed [ ] Open [ ] Won't Fix

## Overall Status

- [ ] All checks passed - Ready for demo
- [ ] Minor issues found - Ready with notes
- [ ] Major issues found - Needs fixes
- [ ] Critical issues found - Not ready

## Recommendations

Based on verification, recommend:
- [ ] Proceed to stakeholder demo
- [ ] Proceed to development of full V4
- [ ] Additional testing needed
- [ ] Fixes required before proceeding
