
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JobSubmission } from "@/types/job";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AppraisalTableProps {
  jobs: JobSubmission[];
  isLoading: boolean;
  onSelectJob: (jobId: string) => void;
}

const statusColors = {
  submitted: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700",
  in_progress: "bg-amber-50/80 text-amber-600 border-amber-200 dark:bg-amber-900/10 dark:text-amber-500 dark:border-amber-800/50",
  loe_pending: "bg-purple-50/80 text-purple-600 border-purple-200 dark:bg-purple-900/10 dark:text-purple-500 dark:border-purple-800/50",
  loe_signed: "bg-emerald-50/80 text-emerald-600 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-500 dark:border-emerald-800/50",
  completed: "bg-emerald-50/80 text-emerald-600 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-500 dark:border-emerald-800/50",
};

const statusLabels = {
  submitted: "Submitted",
  in_progress: "In Progress",
  loe_pending: "LOE Pending",
  loe_signed: "LOE Signed",
  completed: "Completed",
};

const AppraisalTable: React.FC<AppraisalTableProps> = ({ jobs, isLoading, onSelectJob }) => {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-card">
        <p className="text-muted-foreground">No appraisals found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>List of all submitted appraisal requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Job ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Property Address</TableHead>
            <TableHead>Property Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submission Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow 
              key={job.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectJob(job.id)}
            >
              <TableCell className="font-medium">{job.id}</TableCell>
              <TableCell>{job.clientFirstName} {job.clientLastName}</TableCell>
              <TableCell>{job.propertyAddress}</TableCell>
              <TableCell>{job.propertyType}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`${statusColors[job.status as keyof typeof statusColors]} !rounded-md text-xs px-2 py-0.5 font-normal border`}>
                  {statusLabels[job.status as keyof typeof statusLabels]}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const TableSkeleton = () => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Property Address</TableHead>
          <TableHead>Property Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Submission Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: 6 }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default AppraisalTable;
