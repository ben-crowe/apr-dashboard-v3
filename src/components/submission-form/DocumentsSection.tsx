
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import FormSection from "@/components/FormSection";
import { ValidationErrors } from "@/utils/validation";

interface DocumentsSectionProps {
  files: File[];
  error?: string;
  handleFileChange: (files: File[]) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  files,
  error,
  handleFileChange,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    handleFileChange([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    handleFileChange(updatedFiles);
  };

  return (
    <FormSection
      title="Required Documents"
      description=""
    >
      <div className="space-y-6">
        {/* Required Documents List */}
        <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-6 py-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Please upload the following documents:</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-white/80 list-disc pl-6">
            <li>Full Property Details or Prior Appraisal</li>
            <li>Proforma</li>
            <li>Unit Mix (MF/SS) or Rent Roll (Retail/Office/Industrial)</li>
            <li>Operating Expenses (1-3 Years Historical and Budget)</li>
            <li>Drawings/Plans (New Developments only)</li>
            <li>Contact for property tour (Existing Buildings only)</li>
          </ul>
        </div>

        {/* File Upload Zone */}
        <div className="relative border-2 border-dashed border-slate-300 dark:border-white/15 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500/40 transition-colors">
          <Upload className="h-12 w-12 text-slate-400 dark:text-white/30 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-slate-700 dark:text-white/70">Drop files here or click to upload</p>
            <p className="text-sm text-slate-500 dark:text-white/40">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB per file)
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-slate-900 dark:text-white/80">Uploaded Files:</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700">{file.name}</span>
                    <span className="text-xs text-slate-500">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </FormSection>
  );
};

export default DocumentsSection;
