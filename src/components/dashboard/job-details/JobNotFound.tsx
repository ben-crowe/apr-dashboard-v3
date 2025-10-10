
import React from "react";
import { Button } from "@/components/ui/button";

interface JobNotFoundProps {
  onBack: () => void;
}

const JobNotFound: React.FC<JobNotFoundProps> = ({ onBack }) => {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Job not found</p>
      <Button onClick={onBack} className="mt-4">
        Back to Jobs
      </Button>
    </div>
  );
};

export default JobNotFound;
