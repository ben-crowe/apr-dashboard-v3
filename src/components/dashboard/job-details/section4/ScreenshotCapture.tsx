import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera,
  Map,
  Check,
  AlertCircle,
  ExternalLink,
  Eye,
  Maximize2,
  Download,
  Upload,
  RefreshCw,
  MapPin
} from "lucide-react";
import SmartLink from "./SmartLink";

interface ScreenshotCaptureProps {
  type: string;
  label: string;
  currentImage?: string;
  status?: string;
  required: boolean;
  onCapture: () => void;
  smartLink?: string;
}

const ScreenshotCapture: React.FC<ScreenshotCaptureProps> = ({
  type,
  label,
  currentImage,
  status = 'missing',
  required,
  onCapture,
  smartLink
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async () => {
    setIsCapturing(true);
    // Open the smart link in a new tab with instructions
    if (smartLink) {
      window.open(smartLink, '_blank');
      // Show instructions toast
      setTimeout(() => {
        alert("📸 Screenshot Instructions:\n\n1. The map has opened in a new tab\n2. Zoom to the desired level\n3. Take a screenshot (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)\n4. Click 'Upload Screenshot' here to add it");
        setIsCapturing(false);
      }, 500);
    } else {
      // Simulate capture without smart link
      setTimeout(() => {
        onCapture();
        setIsCapturing(false);
      }, 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload an image file (PNG/JPG)');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB');
        return;
      }

      onCapture();
      setShowPreview(true);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'complete':
        return <Badge variant="success" className="h-5"><Check className="h-3 w-3 mr-1" />Captured</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="h-5">Processing...</Badge>;
      default:
        return <Badge variant="outline" className="h-5"><AlertCircle className="h-3 w-3 mr-1" />Not captured</Badge>;
    }
  };

  const getMapIcon = () => {
    if (type.includes('zoning')) return <MapPin className="h-3 w-3" />;
    if (type.includes('flood')) return <Map className="h-3 w-3" />;
    return <Camera className="h-3 w-3" />;
  };

  const getMapInfo = () => {
    if (type.includes('zoning')) {
      return {
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        description: 'Shows zoning designation and land use'
      };
    }
    if (type.includes('flood')) {
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Shows flood risk zones and boundaries'
      };
    }
    return {
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Aerial view of the property'
    };
  };

  const mapInfo = getMapInfo();

  return (
    <div className="space-y-2">
      {/* Main Capture Row */}
      <div className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-3 flex-1">
          {/* Status Icon */}
          <div className="flex items-center justify-center w-8 h-8">
            {currentImage ? (
              <div className={`w-5 h-5 rounded-full ${mapInfo.bgColor} flex items-center justify-center`}>
                <Check className={`h-3 w-3 ${mapInfo.color}`} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                {getMapIcon()}
              </div>
            )}
          </div>

          {/* Map Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{label}</span>
              {required && <span className="text-xs text-red-500">*</span>}
              {getStatusBadge()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mapInfo.description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Smart Link - Open Map */}
          {smartLink && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open(smartLink, '_blank')}
              title="Open map in new tab"
            >
              <ExternalLink className="h-4 w-4 text-blue-600" />
            </Button>
          )}

          {/* View Current Image */}
          {currentImage && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowPreview(!showPreview)}
                title="Preview image"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => window.open(currentImage, '_blank')}
                title="View full size"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Capture/Upload Actions */}
          <div className="flex gap-1">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Capture Button (opens map) */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCapture}
              disabled={isCapturing}
              className="h-7 text-sm"
              title="Open map and take screenshot"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <Camera className="h-3 w-3 mr-1" />
                  Capture
                </>
              )}
            </Button>

            {/* Upload Screenshot Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 text-sm"
              title="Upload a screenshot"
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {currentImage && showPreview && (
        <div className="ml-11">
          <div className="relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
            <img 
              src={currentImage} 
              alt={label}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 bg-white/90 hover:bg-white"
                onClick={() => window.open(currentImage, '_blank')}
                title="View full size"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 bg-white/90 hover:bg-white"
                title="Download image"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Map Type Badge */}
            <div className="absolute bottom-2 left-2">
              <Badge className={`${mapInfo.bgColor} ${mapInfo.color} border-0`}>
                {getMapIcon()}
                <span className="ml-1">{type.replace(/_/g, ' ').toUpperCase()}</span>
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Card (if no image yet) */}
      {!currentImage && smartLink && (
        <div className="ml-11 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
          <p className="font-medium text-blue-900 mb-1">Quick Capture Instructions:</p>
          <ol className="space-y-1 text-blue-700">
            <li>1. Click "Capture" to open the map</li>
            <li>2. Zoom/pan to show the property clearly</li>
            <li>3. Take a screenshot (Cmd+Shift+4 / Win+Shift+S)</li>
            <li>4. Click "Upload" to add your screenshot</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default ScreenshotCapture;