
import React from "react";

const JobListHeader: React.FC = () => {
  return (
    <div className="hidden sm:flex items-center px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
      <div className="w-2 mr-3"></div>
      <div className="flex-grow">JOB & PROPERTY</div>
      <div className="px-4 ml-2 text-right">DATE</div>
      <div className="w-24 text-right">STATUS</div>
      <div className="w-4 ml-2"></div>
    </div>
  );
};

export default JobListHeader;
