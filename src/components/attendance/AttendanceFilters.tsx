import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Users,
  BookOpen,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface AttendanceFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  classes?: string[];
  groups?: string[];
}

interface FilterState {
  searchTerm: string;
  class: string;
  group: string;
  date: Date | undefined;
  status: string;
}

const AttendanceFilters = ({
  onFilterChange = () => {},
  classes = [
    "الصف الأول",
    "الصف الثاني",
    "الصف الثالث",
    "الصف الرابع",
    "الصف الخامس",
  ],
  groups = [
    "مجموعة الفجر",
    "مجموعة الظهر",
    "مجموعة العصر",
    "مجموعة المغرب",
    "مجموعة العشاء",
  ],
}: AttendanceFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    class: "",
    group: "",
    date: new Date(),
    status: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      searchTerm: "",
      class: "",
      group: "",
      date: new Date(),
      status: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div
      className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100"
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            فلترة قائمة الطلاب
          </h3>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            مسح الفلاتر
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث عن طالب..."
              className="pr-9 text-right"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>

          {/* Class Select */}
          <Select
            value={filters.class}
            onValueChange={(value) => handleFilterChange("class", value)}
          >
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر الصف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الصفوف</SelectItem>
              {classes.map((cls, index) => (
                <SelectItem key={index} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Group Select */}
          <Select
            value={filters.group}
            onValueChange={(value) => handleFilterChange("group", value)}
          >
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر المجموعة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المجموعات</SelectItem>
              {groups.map((group, index) => (
                <SelectItem key={index} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-right"
              >
                {filters.date ? (
                  format(filters.date, "dd/MM/yyyy", { locale: ar })
                ) : (
                  <span>اختر التاريخ</span>
                )}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) => handleFilterChange("date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Status Select */}
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="text-right">
              <SelectValue placeholder="حالة الحضور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="present">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <Check className="h-3 w-3 mr-1" /> حاضر
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="absent">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <Users className="h-3 w-3 mr-1" /> غائب
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="late">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    <BookOpen className="h-3 w-3 mr-1" /> متأخر
                  </Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            حاضر: 24
          </Badge>
          <Badge className="bg-red-100 text-red-800 border-red-200">
            غائب: 5
          </Badge>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            متأخر: 3
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            المجموع: 32
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;
