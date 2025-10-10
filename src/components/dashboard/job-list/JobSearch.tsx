
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JobSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const JobSearch: React.FC<JobSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by property name, address or client name..."
        className="pl-8 h-9 text-sm"
        value={searchQuery}
        onChange={onSearchChange}
      />
    </div>
  );
};

export default JobSearch;
