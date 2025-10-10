
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface JobDetailSkeletonProps {
  onBack: () => void;
}

const JobDetailSkeleton: React.FC<JobDetailSkeletonProps> = ({ onBack }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="animate-pulse">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-64 rounded-lg border border-border bg-card animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default JobDetailSkeleton;
