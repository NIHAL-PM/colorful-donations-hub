
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCw, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DonationFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}

const DonationFilters: React.FC<DonationFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  onRefresh,
  onExport
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search donations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 glass-input"
        />
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-40">
            <div className="flex items-center">
              <Filter size={14} className="mr-2" />
              <SelectValue placeholder="Filter by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Donors</SelectItem>
            <SelectItem value="anonymous">Anonymous</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="faculty">Faculty</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          <span className="hidden md:inline">Refresh</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export</span>
        </Button>
      </div>
    </div>
  );
};

export default DonationFilters;
