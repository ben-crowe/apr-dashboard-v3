import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DetailJob, JobDetails } from "@/types/job";
import { Send, X, Download, Mail, Plus, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface LOEPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: DetailJob;
  jobDetails: JobDetails;
  documentHTML: string;
  onApprove: (recipientEmail?: string) => Promise<void>;
}

const LOEPreviewModal: React.FC<LOEPreviewModalProps> = ({
  isOpen,
  onClose,
  job,
  jobDetails,
  documentHTML,
  onApprove
}) => {
  const [isSending, setIsSending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(75); // Default zoom 75%

  // Initialize recipient email with client's email
  useEffect(() => {
    if (job.clientEmail) {
      setRecipientEmail(job.clientEmail);
    }
  }, [job.clientEmail]);

  useEffect(() => {
    // Create a blob URL for the preview with proper scaling CSS
    if (documentHTML) {
      // Add CSS to scale the document based on zoom level
      const zoomDecimal = zoomLevel / 100;
      const scaleValue = 0.9 + (zoomDecimal - 0.75) * 0.5; // Adjust scale proportionally
      
      const scaledHTML = documentHTML.replace(
        '</head>',
        `<style>
          body {
            zoom: ${zoomDecimal};
            transform: scale(${scaleValue});
            transform-origin: top center;
            max-width: 850px;
            margin: 0 auto;
            padding: 20px;
            overflow-x: hidden;
          }
          .document {
            max-width: 850px;
            margin: 0 auto;
          }
          @media print {
            body {
              zoom: 1;
              transform: none;
              max-width: 100%;
            }
          }
        </style>
        </head>`
      );
      
      const blob = new Blob([scaledHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      
      // Cleanup on unmount
      return () => URL.revokeObjectURL(url);
    }
  }, [documentHTML, zoomLevel]);

  const handleSend = async () => {
    // Validate email before sending with proper regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recipientEmail || !emailRegex.test(recipientEmail)) {
      toast.error('Please enter a valid email address (e.g., name@domain.com)');
      setShowEmailEdit(true);
      return;
    }

    setIsSending(true);
    try {
      // Pass the recipient email if it's different from the original
      const emailToUse = recipientEmail !== job.clientEmail ? recipientEmail : undefined;
      await onApprove(emailToUse);
      onClose();
    } catch (error) {
      console.error('Error sending document:', error);
      toast.error('Failed to send document');
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPreview = () => {
    // Create a download link for the HTML
    const blob = new Blob([documentHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LOE-Preview-${job.clientLastName}-${jobDetails.jobNumber || 'DRAFT'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Preview downloaded');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[95vh] flex flex-col p-4">
        {/* Minimal Header */}
        <div className="flex justify-between items-center pb-2 border-b">
          <div>
            <h2 className="text-lg font-semibold">LOE Preview</h2>
            <p className="text-sm text-gray-600">Review Letter of Engagement before sending to client</p>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.max(25, zoomLevel - 10))}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Zoom Out"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              
              <span className="text-xs font-medium px-2 min-w-[45px] text-center dark:text-gray-200">
                {zoomLevel}%
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Zoom In"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(75)}
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200"
                title="Reset Zoom"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Email Recipient Section */}
        <div className="py-2">
          <div className="flex items-center gap-3 py-3 px-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Mail className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              {showEmailEdit ? (
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-blue-900">Send to:</Label>
                  <Input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="flex-1 h-8 text-sm"
                    placeholder="Enter recipient email"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowEmailEdit(false)}
                    className="h-8 text-xs"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-900">E-signature will be sent to:</span>
                    <span className="text-sm font-semibold text-blue-700">{recipientEmail || 'No email specified'}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowEmailEdit(true)}
                    className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  >
                    Change Recipient
                  </Button>
                </div>
              )}
            </div>
          </div>
          {recipientEmail !== job.clientEmail && (
            <p className="text-xs text-orange-600 mt-2 px-1">
              ⚠️ Note: Sending to different email than client's original ({job.clientEmail})
            </p>
          )}
        </div>

        {/* Preview Frame - Maximum space */}
        <div className="flex-1 border rounded-lg overflow-auto bg-gray-100 my-2">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full bg-white"
              title="LOE Document Preview"
              sandbox="allow-same-origin"
              style={{ border: 'none', minHeight: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading preview...
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <p className="text-xs text-gray-500">
            Verify all details are correct before sending
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPreview}
              className="h-7 text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending}
              size="sm"
              className="bg-green-600 hover:bg-green-700 h-8"
            >
              {isSending ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Send to Client
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LOEPreviewModal;