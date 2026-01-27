import React from "react";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";

type GoogleFolderButtonProps = {
  status: boolean;
  isCreating: boolean;
};

const GoogleFolderButton: React.FC<GoogleFolderButtonProps> = ({ 
  status, 
  isCreating 
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled
      className={`flex-1 ${
        status 
          ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/10 hover:text-gray-700 dark:hover:text-gray-300' 
          : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500'
      }`}
    >
      {status 
        ? <Check className="h-4 w-4 mr-1" /> 
        : <AlertTriangle className="h-4 w-4 mr-1" />}
      File Storage
      {isCreating && ' (Creating...)'}
    </Button>
  );
};

export default GoogleFolderButton;