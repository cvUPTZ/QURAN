import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  X,
  Clock,
  MoreVertical,
  MessageCircle,
  Edit,
  Trash2,
  Filter,
  Search,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  group: string;
  status: "present" | "absent" | "late" | "";
  notes: string;
  lastAttendance: string;
  attendanceRate: number;
}

interface StudentsListProps {
  students?: Student[];
  onStatusChange?: (
    studentId: string,
    status: "present" | "absent" | "late",
  ) => void;
  onAddNote?: (studentId: string, note: string) => void;
  onDeleteStudent?: (studentId: string) => void;
  onEditStudent?: (studentId: string) => void;
}

const StudentsList = ({
  students = [],
  onStatusChange = () => {},
  onAddNote = () => {},
  onDeleteStudent = () => {},
  onEditStudent = () => {},
}: StudentsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Default students if none provided
  const defaultStudents: Student[] = [
    {
      id: "1",
      name: "أحمد محمد علي",
      group: "المجموعة الأولى",
      status: "present",
      notes: "",
      lastAttendance: "حاضر منذ 3 أيام",
      attendanceRate: 95,
    },
    {
      id: "2",
      name: "عمر خالد السيد",
      group: "المجموعة الثانية",
      status: "absent",
      notes: "غائب بسبب المرض",
      lastAttendance: "غائب منذ 2 أيام",
      attendanceRate: 80,
    },
    {
      id: "3",
      name: "محمود أحمد حسن",
      group: "المجموعة الأولى",
      status: "late",
      notes: "تأخر 15 دقيقة",
      lastAttendance: "متأخر منذ 1 يوم",
      attendanceRate: 85,
    },
    {
      id: "4",
      name: "عبد الرحمن محمد",
      group: "المجموعة الثالثة",
      status: "",
      notes: "",
      lastAttendance: "حاضر منذ 1 يوم",
      attendanceRate: 90,
    },
    {
      id: "5",
      name: "يوسف إبراهيم",
      group: "المجموعة الثانية",
      status: "",
      notes: "",
      lastAttendance: "غائب منذ 4 أيام",
      attendanceRate: 75,
    },
    {
      id: "6",
      name: "زياد محمود",
      group: "المجموعة الثالثة",
      status: "",
      notes: "",
      lastAttendance: "حاضر منذ 2 يوم",
      attendanceRate: 88,
    },
    {
      id: "7",
      name: "خالد عبد العزيز",
      group: "المجموعة الأولى",
      status: "",
      notes: "",
      lastAttendance: "حاضر منذ 1 يوم",
      attendanceRate: 92,
    },
  ];

  const displayStudents = students.length > 0 ? students : defaultStudents;

  // Filter students based on search term
  const filteredStudents = displayStudents.filter(
    (student) =>
      student.name.includes(searchTerm) || student.group.includes(searchTerm),
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            حاضر
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">غائب</Badge>
        );
      case "late":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            متأخر
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            لم يُسجل
          </Badge>
        );
    }
  };

  const getAttendanceRateBadge = (rate: number) => {
    if (rate >= 90) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
          {rate}%
        </Badge>
      );
    } else if (rate >= 80) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          {rate}%
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          {rate}%
        </Badge>
      );
    }
  };

  return (
    <div
      className="w-full bg-white rounded-xl shadow-sm"
      style={{ direction: "rtl" }}
    >
      {/* Search and actions bar */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن طالب..."
            className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            فلترة
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <UserCheck className="h-4 w-4" />
            تحديد الكل حاضر
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <UserX className="h-4 w-4" />
            تحديد الكل غائب
          </Button>
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-semibold text-gray-700 border-b">
        <div className="col-span-1 flex items-center justify-center">
          <Checkbox
            checked={
              selectedStudents.length === filteredStudents.length &&
              filteredStudents.length > 0
            }
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
        </div>
        <div className="col-span-3">اسم الطالب</div>
        <div className="col-span-2">المجموعة</div>
        <div className="col-span-2">آخر حضور</div>
        <div className="col-span-1">نسبة الحضور</div>
        <div className="col-span-3">تسجيل الحضور</div>
      </div>

      {/* Students list */}
      {filteredStudents.length > 0 ? (
        <div className="divide-y">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
            >
              <div className="col-span-1 flex items-center justify-center">
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  onCheckedChange={(checked) =>
                    handleSelectStudent(student.id, checked as boolean)
                  }
                />
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <div className="flex-1">
                  <div className="font-medium">{student.name}</div>
                  {student.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      {student.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2">{student.group}</div>

              <div className="col-span-2 text-sm text-gray-600">
                {student.lastAttendance}
              </div>

              <div className="col-span-1">
                {getAttendanceRateBadge(student.attendanceRate)}
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          student.status === "present" ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          student.status === "present" ? "bg-emerald-600" : ""
                        }
                        onClick={() => onStatusChange(student.id, "present")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>حاضر</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          student.status === "absent" ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          student.status === "absent" ? "bg-red-600" : ""
                        }
                        onClick={() => onStatusChange(student.id, "absent")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>غائب</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          student.status === "late" ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          student.status === "late" ? "bg-amber-600" : ""
                        }
                        onClick={() => onStatusChange(student.id, "late")}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>متأخر</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddNote(student.id, "")}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>إضافة ملاحظة</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditStudent(student.id)}>
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل بيانات الطالب
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteStudent(student.id)}
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف الطالب
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          لا يوجد طلاب مطابقين لمعايير البحث
        </div>
      )}

      {/* Pagination */}
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          إجمالي الطلاب: {filteredStudents.length}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            السابق
          </Button>
          <Button variant="outline" size="sm" className="bg-emerald-50">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
