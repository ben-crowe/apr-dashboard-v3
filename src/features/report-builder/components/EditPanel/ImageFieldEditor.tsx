import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReportBuilderStore } from '../../store/reportBuilderStore';
import { ReportField } from '../../types/reportBuilder.types';
import { GripVertical, X, Plus } from 'lucide-react';

interface ImageFieldEditorProps {
  field: ReportField;
}

export default function ImageFieldEditor({ field }: ImageFieldEditorProps) {
  const { reorderImages, addImage, removeImage } = useReportBuilderStore();
  const [newImageUrl, setNewImageUrl] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const images = (field.value as string[]) || [];

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    reorderImages(field.id, newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      addImage(field.id, newImageUrl.trim());
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    removeImage(field.id, imageUrl);
  };

  return (
    <div className="space-y-4">
      <Label>{field.label}</Label>

      {/* Image list with drag-and-drop */}
      <div className="space-y-2">
        {images.map((imageUrl, index) => (
          <div
            key={`${imageUrl}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 p-3 bg-muted rounded-md cursor-move hover:bg-muted/80 transition-colors ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <img
              src={imageUrl}
              alt={`Property ${index + 1}`}
              className="w-16 h-16 object-cover rounded border border-border"
            />
            <span className="flex-1 text-sm truncate">{imageUrl}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveImage(imageUrl)}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new image */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddImage();
            }
          }}
        />
        <Button onClick={handleAddImage} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-md">
          No images added yet. Add an image URL above to get started.
        </p>
      )}
    </div>
  );
}
