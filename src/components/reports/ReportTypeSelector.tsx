import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Users, User } from "lucide-react";

interface Student {
  id: string;
  name: string;
  grade: string;
  group: string;
}

interface Group {
  id: string;
  name: string;
  studentsCount: number;
  teacher: string;
}

interface ReportTypeSelectorProps {
  onSelectStudent?: (student: Student) => void;
  onSelectGroup?: (group: Group) => void;
  students?: Student[];
  groups?: Group[];
}

const ReportTypeSelector = ({
  onSelectStudent = () => {},
  onSelectGroup = () => {},
  students = [
    {
      id: "1",
      name: "أحمد محمد",
      grade: "الصف الخامس",
      group: "مجموعة الفرقان",
    },
    { id: "2", name: "عمر خالد", grade: "الصف السادس", group: "مجموعة النور" },
    { id: "3", name: "فاطمة علي", grade: "الصف الرابع", group: "مجموعة الهدى" },
    {
      id: "4",
      name: "سارة أحمد",
      grade: "الصف الخامس",
      group: "مجموعة الفرقان",
    },
    {
      id: "5",
      name: "محمد إبراهيم",
      grade: "الصف السادس",
      group: "مجموعة النور",
    },
  ],
  groups = [
    {
      id: "1",
      name: "مجموعة الفرقان",
      studentsCount: 15,
      teacher: "أ. محمد عبدالله",
    },
    {
      id: "2",
      name: "مجموعة النور",
      studentsCount: 12,
      teacher: "أ. أحمد علي",
    },
    {
      id: "3",
      name: "مجموعة الهدى",
      studentsCount: 10,
      teacher: "أ. خالد محمود",
    },
    {
      id: "4",
      name: "مجموعة الإيمان",
      studentsCount: 14,
      teacher: "أ. عبدالرحمن سعيد",
    },
  ],
}: ReportTypeSelectorProps) => {
  const [activeTab, setActiveTab] = useState("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // Filter students based on search query and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.includes(searchQuery) || searchQuery === "";
    const matchesGrade =
      selectedGrade === "all" || student.grade === selectedGrade;
    const matchesGroup =
      selectedGroup === "all" || student.group === selectedGroup;
    return matchesSearch && matchesGrade && matchesGroup;
  });

  // Get unique grades and groups for filters
  const uniqueGrades = [...new Set(students.map((student) => student.grade))];
  const uniqueGroups = [...new Set(students.map((student) => student.group))];

  return (
    <Card className="w-full bg-white border-2 border-sky-100 shadow-md">
      <CardContent className="p-6">
        <div className="mb-6 text-right">
          <h2 className="text-xl font-bold text-gray-800">
            اختيار نوع التقرير
          </h2>
          <p className="text-sm text-gray-600">
            حدد نوع التقرير الذي ترغب في عرضه
          </p>
        </div>

        <Tabs
          defaultValue="individual"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          dir="rtl"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="individual"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-sky-100 data-[state=active]:text-sky-800"
            >
              <User size={18} />
              <span>تقرير فردي</span>
            </TabsTrigger>
            <TabsTrigger
              value="group"
              className="flex items-center justify-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              <Users size={18} />
              <span>تقرير جماعي</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="ابحث عن طالب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-right block">الصف الدراسي</Label>
                  <Select
                    value={selectedGrade}
                    onValueChange={setSelectedGrade}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="جميع الصفوف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الصفوف</SelectItem>
                      {uniqueGrades.map((grade) => (
                        <SelectItem key={grade} value={grade || "unknown"}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">المجموعة</Label>
                  <Select
                    value={selectedGroup}
                    onValueChange={setSelectedGroup}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="جميع المجموعات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع المجموعات</SelectItem>
                      {uniqueGroups.map((group) => (
                        <SelectItem key={group} value={group || "unknown"}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-3 text-right font-medium text-sm text-gray-700 border-b">
                  قائمة الطلاب ({filteredStudents.length})
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredStudents.length > 0 ? (
                    <div className="divide-y">
                      {filteredStudents.map((student) => (
                        <div
                          key={student.id}
                          className="p-3 flex justify-between items-center hover:bg-sky-50 cursor-pointer"
                          onClick={() => onSelectStudent(student)}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sky-700 border-sky-200 hover:bg-sky-100"
                          >
                            عرض التقرير
                          </Button>
                          <div className="text-right">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">
                              {student.grade} - {student.group}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      لا توجد نتائج مطابقة للبحث
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="group" className="space-y-4">
            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-3 text-right font-medium text-sm text-gray-700 border-b">
                قائمة المجموعات ({groups.length})
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="divide-y">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="p-3 flex justify-between items-center hover:bg-emerald-50 cursor-pointer"
                      onClick={() => onSelectGroup(group)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      >
                        عرض التقرير
                      </Button>
                      <div className="text-right">
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-gray-500">
                          {group.studentsCount} طالب - {group.teacher}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportTypeSelector;
