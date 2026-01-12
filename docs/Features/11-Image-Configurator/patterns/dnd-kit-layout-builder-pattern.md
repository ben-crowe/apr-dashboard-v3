# dnd-kit Layout Builder Pattern

A comprehensive pattern guide for building an Image Page Configurator with drag-drop functionality using the dnd-kit library in React.

## Table of Contents

1. [Installation](#installation)
2. [Key Concepts](#key-concepts)
3. [Pattern 1: DndContext Setup](#pattern-1-dndcontext-setup)
4. [Pattern 2: Draggable Gallery Item](#pattern-2-draggable-gallery-item)
5. [Pattern 3: Droppable Slot](#pattern-3-droppable-slot)
6. [Pattern 4: Handle Drop Assignment](#pattern-4-handle-drop-assignment)
7. [Pattern 5: DragOverlay for Visual Feedback](#pattern-5-dragoverlay-for-visual-feedback)
8. [Pattern 6: Sensors Configuration](#pattern-6-sensors-configuration)
9. [Full Example: Gallery to Slot Layout](#full-example-gallery-to-slot-layout)
10. [TypeScript Types](#typescript-types)

---

## Installation

```bash
npm install @dnd-kit/core @dnd-kit/utilities @dnd-kit/modifiers
```

**Package purposes:**
- `@dnd-kit/core` - Core drag-drop functionality (DndContext, useDraggable, useDroppable)
- `@dnd-kit/utilities` - CSS transform utilities
- `@dnd-kit/modifiers` - Movement restriction modifiers (optional)

---

## Key Concepts

### Draggable vs Droppable

| Concept | Hook | Purpose |
|---------|------|---------|
| **Draggable** | `useDraggable` | Makes an element pickable and movable |
| **Droppable** | `useDroppable` | Defines a zone that accepts draggable items |

### Core Architecture

```
DndContext (Provider)
    |
    +-- Gallery (Source)
    |       +-- Draggable Items (images from gallery)
    |
    +-- Layout Grid (Target)
            +-- Droppable Slots (accept one image each)
```

### Event Flow

1. **onDragStart** - User initiates drag, capture the active item ID
2. **onDragOver** - Item hovers over a droppable (optional tracking)
3. **onDragEnd** - User releases, check `event.over` for target slot
4. **onDragCancel** - User cancels (Escape key)

---

## Pattern 1: DndContext Setup

The `DndContext` provider wraps all draggable and droppable components, managing state and events.

```tsx
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';

interface SlotAssignment {
  [slotId: string]: string | null; // slotId -> imageId
}

function ImageConfigurator() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slotAssignments, setSlotAssignments] = useState<SlotAssignment>({
    'slot-0-0': null,
    'slot-0-1': null,
    'slot-1-0': null,
    'slot-1-1': null,
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id) {
      // Handle assignment logic here
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Gallery and Layout components go here */}
    </DndContext>
  );
}
```

---

## Pattern 2: Draggable Gallery Item

Gallery items use `useDraggable` to become pickable. The `transform` value positions the item during drag.

```tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableImageProps {
  id: string;
  src: string;
  alt: string;
  isDragDisabled?: boolean;
}

function DraggableImage({ id, src, alt, isDragDisabled = false }: DraggableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id,
    disabled: isDragDisabled,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragDisabled ? 'not-allowed' : 'grab',
    touchAction: 'none', // Important for mobile support
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="gallery-item"
    >
      <img src={src} alt={alt} draggable={false} />
    </div>
  );
}

export default DraggableImage;
```

### Key Points:
- `setNodeRef` - Attach to the DOM element for collision detection
- `listeners` - Event handlers for drag initiation
- `attributes` - Accessibility attributes (role, tabIndex, aria-*)
- `transform` - Current position offset during drag
- `isDragging` - Boolean to apply visual feedback
- `touchAction: 'none'` - Prevents browser touch gestures during drag

---

## Pattern 3: Droppable Slot

Layout slots use `useDroppable` to accept dropped items. The `isOver` property indicates hover state.

```tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableSlotProps {
  id: string;
  children?: React.ReactNode;
  assignedImageId?: string | null;
  images: Map<string, { src: string; alt: string }>;
}

function DroppableSlot({ id, assignedImageId, images }: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const assignedImage = assignedImageId ? images.get(assignedImageId) : null;

  const style: React.CSSProperties = {
    border: isOver ? '2px solid #4CAF50' : '2px dashed #ccc',
    backgroundColor: isOver ? 'rgba(76, 175, 80, 0.1)' : '#f5f5f5',
    transition: 'border-color 0.2s, background-color 0.2s',
    minHeight: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} className="layout-slot">
      {assignedImage ? (
        <img
          src={assignedImage.src}
          alt={assignedImage.alt}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ color: '#999' }}>Drop image here</span>
      )}
    </div>
  );
}

export default DroppableSlot;
```

### Creating Multiple Slots Dynamically

```tsx
function LayoutGrid({ rows, cols, slotAssignments, images }) {
  const slots = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const slotId = `slot-${row}-${col}`;
      slots.push(
        <DroppableSlot
          key={slotId}
          id={slotId}
          assignedImageId={slotAssignments[slotId]}
          images={images}
        />
      );
    }
  }

  return (
    <div
      className="layout-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '8px',
      }}
    >
      {slots}
    </div>
  );
}
```

---

## Pattern 4: Handle Drop Assignment

The `onDragEnd` handler processes drops and updates state. This is where you implement the assignment logic.

```tsx
import { DragEndEvent } from '@dnd-kit/core';

interface SlotAssignment {
  [slotId: string]: string | null;
}

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  // If not dropped on a valid target, do nothing
  if (!over) {
    setActiveId(null);
    return;
  }

  const draggedImageId = active.id as string;
  const targetSlotId = over.id as string;

  // Check if target is a slot (not another gallery item)
  if (!targetSlotId.startsWith('slot-')) {
    setActiveId(null);
    return;
  }

  setSlotAssignments((prev) => {
    const newAssignments = { ...prev };

    // Find if this image is already assigned to another slot
    const existingSlot = Object.entries(prev).find(
      ([_, imageId]) => imageId === draggedImageId
    );

    // Get what's currently in the target slot
    const targetCurrentImage = prev[targetSlotId];

    // If image was in another slot, handle swap
    if (existingSlot) {
      const [existingSlotId] = existingSlot;

      if (targetCurrentImage) {
        // Swap: put target's image into the source slot
        newAssignments[existingSlotId] = targetCurrentImage;
      } else {
        // Clear the source slot
        newAssignments[existingSlotId] = null;
      }
    }

    // Assign the dragged image to target slot
    newAssignments[targetSlotId] = draggedImageId;

    return newAssignments;
  });

  setActiveId(null);
}
```

### Logic Breakdown

1. **Validate drop target** - Ensure `over` exists and is a slot
2. **Find existing assignment** - Check if dragged image is already in a slot
3. **Handle swap** - If target has an image and source was a slot, swap them
4. **Update assignment** - Set the dragged image to the target slot

---

## Pattern 5: DragOverlay for Visual Feedback

`DragOverlay` renders a floating preview during drag, improving UX especially when dragging between containers.

```tsx
import React, { useState } from 'react';
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';

function ImageConfigurator({ images }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slotAssignments, setSlotAssignments] = useState<SlotAssignment>({});

  const activeImage = activeId ? images.get(activeId) : null;

  return (
    <DndContext
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <ImageGallery images={images} />
      <LayoutGrid slotAssignments={slotAssignments} images={images} />

      {/* DragOverlay must stay mounted - only conditionally render children */}
      <DragOverlay dropAnimation={{ duration: 250 }}>
        {activeImage ? (
          <div className="drag-preview" style={{
            width: '100px',
            height: '100px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

### DragOverlay Props

| Prop | Type | Description |
|------|------|-------------|
| `dropAnimation` | `{ duration: number, easing: string }` | Animation on drop |
| `modifiers` | `Modifier[]` | Restrict movement |
| `zIndex` | `number` | Stacking order (default: 999) |

---

## Pattern 6: Sensors Configuration

Configure how drag operations are initiated with different input methods.

```tsx
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

function ImageConfigurator() {
  // Pointer sensor with distance constraint
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // 8px movement before drag activates
    },
  });

  // Touch sensor with delay for mobile
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200, // 200ms hold before drag
      tolerance: 5, // 5px movement tolerance during delay
    },
  });

  // Keyboard sensor for accessibility
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  return (
    <DndContext sensors={sensors}>
      {/* ... */}
    </DndContext>
  );
}
```

### Activation Constraints

| Constraint | Purpose |
|------------|---------|
| `distance` | Minimum pixels moved before activation |
| `delay` | Milliseconds to hold before activation |
| `tolerance` | Allowed movement during delay period |

---

## Full Example: Gallery to Slot Layout

Complete working implementation combining all patterns:

```tsx
// ImagePageConfigurator.tsx
import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable, useDroppable } from '@dnd-kit/core';

// Types
interface ImageData {
  id: string;
  src: string;
  alt: string;
}

interface SlotAssignment {
  [slotId: string]: string | null;
}

// Draggable Image Component
function DraggableImage({ id, src, alt }: ImageData) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
    touchAction: 'none',
    width: '80px',
    height: '80px',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

// Droppable Slot Component
function DroppableSlot({
  id,
  assignedImageId,
  images
}: {
  id: string;
  assignedImageId: string | null;
  images: Map<string, ImageData>;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const assignedImage = assignedImageId ? images.get(assignedImageId) : null;

  const style: React.CSSProperties = {
    border: isOver ? '3px solid #2196F3' : '2px dashed #bbb',
    backgroundColor: isOver ? 'rgba(33, 150, 243, 0.1)' : '#fafafa',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: '1',
    transition: 'all 0.2s ease',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {assignedImage ? (
        <img
          src={assignedImage.src}
          alt={assignedImage.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '6px',
          }}
        />
      ) : (
        <span style={{ color: '#aaa', fontSize: '14px' }}>
          {isOver ? 'Release to drop' : 'Drop here'}
        </span>
      )}
    </div>
  );
}

// Image Gallery Component
function ImageGallery({ images }: { images: Map<string, ImageData> }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '16px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      marginBottom: '24px',
    }}>
      <h3 style={{ width: '100%', margin: '0 0 12px 0' }}>Image Gallery</h3>
      {Array.from(images.values()).map((image) => (
        <DraggableImage key={image.id} {...image} />
      ))}
    </div>
  );
}

// Layout Grid Component
function LayoutGrid({
  rows,
  cols,
  slotAssignments,
  images
}: {
  rows: number;
  cols: number;
  slotAssignments: SlotAssignment;
  images: Map<string, ImageData>;
}) {
  const slots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const slotId = `slot-${row}-${col}`;
      slots.push(
        <DroppableSlot
          key={slotId}
          id={slotId}
          assignedImageId={slotAssignments[slotId]}
          images={images}
        />
      );
    }
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '12px',
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    }}>
      <h3 style={{ gridColumn: '1 / -1', margin: '0 0 12px 0' }}>
        Layout ({rows}x{cols})
      </h3>
      {slots}
    </div>
  );
}

// Main Configurator Component
export default function ImagePageConfigurator() {
  // Sample images
  const images = useMemo(() => new Map<string, ImageData>([
    ['img-1', { id: 'img-1', src: '/images/photo1.jpg', alt: 'Photo 1' }],
    ['img-2', { id: 'img-2', src: '/images/photo2.jpg', alt: 'Photo 2' }],
    ['img-3', { id: 'img-3', src: '/images/photo3.jpg', alt: 'Photo 3' }],
    ['img-4', { id: 'img-4', src: '/images/photo4.jpg', alt: 'Photo 4' }],
    ['img-5', { id: 'img-5', src: '/images/photo5.jpg', alt: 'Photo 5' }],
    ['img-6', { id: 'img-6', src: '/images/photo6.jpg', alt: 'Photo 6' }],
  ]), []);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [slotAssignments, setSlotAssignments] = useState<SlotAssignment>({
    'slot-0-0': null,
    'slot-0-1': null,
    'slot-1-0': null,
    'slot-1-1': null,
  });

  // Sensors
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  // Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !String(over.id).startsWith('slot-')) return;

    const draggedImageId = active.id as string;
    const targetSlotId = over.id as string;

    setSlotAssignments((prev) => {
      const newAssignments = { ...prev };

      // Find if this image is already in a slot
      const sourceSlotEntry = Object.entries(prev).find(
        ([_, imageId]) => imageId === draggedImageId
      );

      const targetCurrentImage = prev[targetSlotId];

      if (sourceSlotEntry) {
        const [sourceSlotId] = sourceSlotEntry;
        // Swap if target has an image
        newAssignments[sourceSlotId] = targetCurrentImage;
      }

      newAssignments[targetSlotId] = draggedImageId;
      return newAssignments;
    });
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeImage = activeId ? images.get(activeId) : null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1>Image Page Configurator</h1>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <ImageGallery images={images} />
        <LayoutGrid
          rows={2}
          cols={2}
          slotAssignments={slotAssignments}
          images={images}
        />

        <DragOverlay dropAnimation={{ duration: 200 }}>
          {activeImage ? (
            <div style={{
              width: '100px',
              height: '100px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              borderRadius: '8px',
              overflow: 'hidden',
              transform: 'scale(1.05)',
            }}>
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Debug output */}
      <pre style={{ marginTop: '24px', padding: '12px', background: '#f5f5f5' }}>
        {JSON.stringify(slotAssignments, null, 2)}
      </pre>
    </div>
  );
}
```

---

## TypeScript Types

Common type definitions for dnd-kit:

```typescript
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  DragMoveEvent,
  DragCancelEvent,
  Active,
  Over,
  UniqueIdentifier,
} from '@dnd-kit/core';

// Event object structure
interface DragEvent {
  active: Active;      // { id: UniqueIdentifier, data: DataRef, rect: ViewRect }
  over: Over | null;   // { id: UniqueIdentifier, rect: ClientRect, disabled: boolean }
}

// Custom types for your use case
type SlotId = `slot-${number}-${number}`;
type ImageId = string;

interface SlotAssignments {
  [K: SlotId]: ImageId | null;
}

interface ImageData {
  id: ImageId;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}
```

---

## Best Practices

1. **Always use DragOverlay** - Provides smooth cross-container dragging
2. **Set `touchAction: 'none'`** - Prevents browser gestures on mobile
3. **Use distance activation constraint** - Prevents accidental drags on click
4. **Unique IDs** - Every draggable and droppable needs a unique ID
5. **Keep DragOverlay mounted** - Only conditionally render children
6. **Use CSS.Translate** - Better performance than manual transform strings
7. **Accessibility** - Keep `attributes` spread for keyboard/screen reader support

---

## Resources

- [Official dnd-kit Documentation](https://docs.dndkit.com)
- [dnd-kit GitHub Repository](https://github.com/clauderic/dnd-kit)
- [Droppable API Reference](https://docs.dndkit.com/api-documentation/droppable)
- [DragOverlay Guide](https://docs.dndkit.com/api-documentation/draggable/drag-overlay)
- [Sensors Configuration](https://docs.dndkit.com/api-documentation/sensors)
