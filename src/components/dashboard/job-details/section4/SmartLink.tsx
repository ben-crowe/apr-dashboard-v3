import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface SmartLinkProps {
  url: string;
  label?: string;
}

const SmartLink: React.FC<SmartLinkProps> = ({ url, label = "Get Document" }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => window.open(url, '_blank')}
      title={label}
    >
      <ExternalLink className="h-4 w-4 text-blue-600" />
    </Button>
  );
};

export default SmartLink;