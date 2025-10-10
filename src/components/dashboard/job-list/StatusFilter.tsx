
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFilterProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <Select 
      value={statusFilter} 
      onValueChange={onStatusFilterChange}
    >
      <SelectTrigger className="w-[160px] h-9 text-sm">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Jobs</SelectItem>
        <SelectItem value="submitted">Submitted</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="loe_pending">LOE Pending</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
