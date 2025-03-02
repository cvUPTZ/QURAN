import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AttendanceFilters from "./AttendanceFilters";
import StudentsList from "./StudentsList";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Save, FileDown, Printer } from "lucide-react";

interface Student {
  id: string;
  name: string;
  group: string;
  status: "present" | "absent" | "late" | "";
  notes: string;
  lastAttendance: string;
  attendanceRate: number;
}

interface FilterState {
  searchTerm: string;
  class: string;
  group: string;
  date: Date | undefined;
  status: string;
}

interface AttendancePageProps {
  students?: Student[];
  classes?: string[];
  groups?: string[];
  date?: Date;
}

const AttendancePage = ({
  students = [],
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
  date = new Date(),
}: AttendancePageProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    class: "",
    group: "",
    date: date,
    status: "",
  });

  const [attendanceData, setAttendanceData] = useState<Student[]>(students);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // In a real app, you would filter the students based on the filters
    // or fetch new data from the server
  };

  const handleStatusChange = (
    studentId: string,
    status: "present" | "absent" | "late",
  ) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === studentId ? { ...student, status } : student,
      ),
    );
  };

  const handleAddNote = (studentId: string, note: string) => {
    setAttendanceData((prevData) =>
      prevData.map((student) =>
        student.id === studentId ? { ...student, notes: note } : student,
      ),
    );
  };

  const handleSaveAttendance = () => {
    // Placeholder for saving attendance data to the server
    console.log("Saving attendance data:", attendanceData);
    // In a real app, you would make an API call here
  };

  const handleExportAttendance = () => {
    // Placeholder for exporting attendance data
    console.log("Exporting attendance data");
    // In a real app, you would generate and download a file
  };

  const handlePrintAttendance = () => {
    // Placeholder for printing attendance data
    console.log("Printing attendance data");
    // In a real app, you would open a print dialog
    window.print();
  };

  return (
    <div
      className="w-full min-h-screen bg-[#f8f7f2] p-6"
      style={{ direction: "rtl" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">تسجيل الحضور</h1>
          <p className="text-gray-600">تسجيل حضور وغياب الطلاب</p>
        </div>

        {/* Main Content */}
        <Card className="border-2 border-emerald-100 shadow-md">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="text-xl font-bold text-emerald-800 flex items-center justify-between">
              <span>سجل الحضور اليومي</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  onClick={handleSaveAttendance}
                >
                  <Save className="h-4 w-4" />
                  حفظ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  onClick={handleExportAttendance}
                >
                  <FileDown className="h-4 w-4" />
                  تصدير
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  onClick={handlePrintAttendance}
                >
                  <Printer className="h-4 w-4" />
                  طباعة
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Filters */}
            <AttendanceFilters
              onFilterChange={handleFilterChange}
              classes={classes}
              groups={groups}
            />

            <Separator className="my-6" />

            {/* Students List */}
            <StudentsList
              students={attendanceData}
              onStatusChange={handleStatusChange}
              onAddNote={handleAddNote}
              onDeleteStudent={(id) => console.log(`Delete student ${id}`)}
              onEditStudent={(id) => console.log(`Edit student ${id}`)}
            />
          </CardContent>
        </Card>

        {/* Islamic Pattern Decoration */}
        <div className="mt-8 opacity-10">
          <div className="h-24 w-full bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000')] bg-repeat-x bg-contain" />
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
