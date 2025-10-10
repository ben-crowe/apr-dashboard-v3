
import React from "react";

interface JobListLoadingProps {
  count?: number;
}

export const JobListLoading: React.FC<JobListLoadingProps> = ({ count = 8 }) => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-md border border-border/50 bg-card"
        ></div>
      ))}
    </div>
  );
};

export const JobListEmpty: React.FC = () => {
  return (
    <div className="text-center py-12 bg-card rounded-lg shadow-md">
      <p className="text-muted-foreground">No jobs found</p>
    </div>
  );
};
