import React, { useState } from "react";
import { Search, UserRound, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Student {
  id: string;
  name: string;
  group: string;
  level: string;
  lastSession?: string;
  progress?: number;
  avatarUrl?: string;
}

interface StudentSelectorProps {
  students?: Student[];
  onSelectStudent?: (student: Student) => void;
  selectedStudent?: Student | null;
}

const StudentSelector = ({
  students = [],
  onSelectStudent = () => {},
  selectedStudent = null,
}: StudentSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Default students if none provided
  const defaultStudents: Student[] = [
    {
      id: "1",
      name: "أحمد محمد علي",
      group: "المجموعة الأولى",
      level: "متوسط",
      lastSession: "منذ يومين",
      progress: 65,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    },
    {
      id: "2",
      name: "عمر خالد السيد",
      group: "المجموعة الثانية",
      level: "متقدم",
      lastSession: "اليوم",
      progress: 82,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=omar",
    },
    {
      id: "3",
      name: "فاطمة أحمد حسن",
      group: "المجموعة الأولى",
      level: "مبتدئ",
      lastSession: "منذ 3 أيام",
      progress: 40,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
    },
    {
      id: "4",
      name: "محمد إبراهيم سعيد",
      group: "المجموعة الثالثة",
      level: "متوسط",
      lastSession: "منذ أسبوع",
      progress: 55,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohamed",
    },
    {
      id: "5",
      name: "نور محمد الصادق",
      group: "المجموعة الثانية",
      level: "متقدم",
      lastSession: "أمس",
      progress: 75,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=noor",
    },
    {
      id: "6",
      name: "خالد عبد الرحمن",
      group: "المجموعة الثالثة",
      level: "متقدم",
      lastSession: "منذ 3 أيام",
      progress: 88,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled",
    },
    {
      id: "7",
      name: "سارة محمود",
      group: "المجموعة الأولى",
      level: "متوسط",
      lastSession: "اليوم",
      progress: 70,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
    },
    {
      id: "8",
      name: "يوسف أحمد",
      group: "المجموعة الثانية",
      level: "مبتدئ",
      lastSession: "منذ يوم",
      progress: 45,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=yousef",
    },
    {
      id: "9",
      name: "ليلى عبد الله",
      group: "المجموعة الثالثة",
      level: "متوسط",
      lastSession: "منذ 5 أيام",
      progress: 60,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=layla",
    },
    {
      id: "10",
      name: "زياد محمد",
      group: "المجموعة الأولى",
      level: "متقدم",
      lastSession: "أمس",
      progress: 92,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ziad",
    },
  ];

  const displayStudents = students.length > 0 ? students : defaultStudents;

  // Extract unique groups and levels for filters
  const groups = [...new Set(displayStudents.map((student) => student.group))];
  const levels = [...new Set(displayStudents.map((student) => student.level))];

  // Filter students based on search query and selected filters
  const filteredStudents = displayStudents.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup ? student.group === selectedGroup : true;
    const matchesLevel = selectedLevel ? student.level === selectedLevel : true;
    return matchesSearch && matchesGroup && matchesLevel;
  });

  return (
    <Card
      className="w-full bg-white border-2 border-sky-100 shadow-md"
      dir="rtl"
    >
      <CardHeader className="pb-2 bg-sky-50 border-b border-sky-100">
        <CardTitle className="text-xl font-bold text-sky-800 flex items-center font-amiri">
          <UserRound className="ml-2 h-5 w-5" />
          اختيار الطالب
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Search and filters */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن طالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 text-right"
              />
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    {selectedGroup || "المجموعة"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedGroup(null)}>
                    الكل
                  </DropdownMenuItem>
                  {groups.map((group) => (
                    <DropdownMenuItem
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                    >
                      {group}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    {selectedLevel || "المستوى"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedLevel(null)}>
                    الكل
                  </DropdownMenuItem>
                  {levels.map((level) => (
                    <DropdownMenuItem
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                    >
                      {level}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Students list */}
          <div className="space-y-2 mt-2">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${selectedStudent?.id === student.id ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-sky-200 hover:bg-sky-50/50"} cursor-pointer transition-colors`}
                  onClick={() => onSelectStudent(student)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.avatarUrl} alt={student.name} />
                      <AvatarFallback className="bg-sky-100 text-sky-700">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {student.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="bg-sky-50 text-sky-700 text-xs"
                        >
                          {student.group}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 text-xs"
                        >
                          {student.level}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {student.lastSession && (
                      <span className="text-xs text-gray-500">
                        آخر حصة: {student.lastSession}
                      </span>
                    )}
                    {student.progress !== undefined && (
                      <div className="flex items-center gap-1">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-700">
                          {student.progress}%
                        </span>
                      </div>
                    )}
                    {selectedStudent?.id === student.id && (
                      <Check className="h-5 w-5 text-sky-600" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">لا يوجد طلاب مطابقين للبحث</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentSelector;
