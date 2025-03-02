import React, { useState } from "react";
import { BarChart3, FileBarChart, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReportTypeSelector from "./ReportTypeSelector";
import ChartDisplay from "./ChartDisplay";

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

interface ReportsPageProps {
  students?: Student[];
  groups?: Group[];
}

const ReportsPage = ({ students = [], groups = [] }: ReportsPageProps) => {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handle student selection
  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setSelectedGroup(null);
    setSelectedTab("student");
  };

  // Handle group selection
  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setSelectedStudent(null);
    setSelectedTab("group");
  };

  // Reset selections and go back to overview
  const handleBackToOverview = () => {
    setSelectedStudent(null);
    setSelectedGroup(null);
    setSelectedTab("overview");
  };

  return (
    <div
      className="w-full min-h-screen bg-[#f8f7f2] p-6"
      style={{ direction: "rtl" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">
            التقارير البيانية
          </h1>
          <p className="text-gray-600">
            عرض وتحليل تقدم الطلاب في الحفظ والتلاوة
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Tabs for different report views */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
              <TabsList className="grid w-full grid-cols-3 mb-0">
                <TabsTrigger
                  value="overview"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-sky-100 data-[state=active]:text-sky-800"
                  disabled={
                    selectedTab === "student" || selectedTab === "group"
                  }
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>نظرة عامة</span>
                </TabsTrigger>
                <TabsTrigger
                  value="student"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
                  disabled={!selectedStudent}
                >
                  <FileBarChart className="h-4 w-4" />
                  <span>تقرير الطالب</span>
                </TabsTrigger>
                <TabsTrigger
                  value="group"
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                  disabled={!selectedGroup}
                >
                  <FileBarChart className="h-4 w-4" />
                  <span>تقرير المجموعة</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <ReportTypeSelector
                    onSelectStudent={handleStudentSelect}
                    onSelectGroup={handleGroupSelect}
                  />
                </div>
                <div className="lg:col-span-7">
                  <Card className="w-full bg-white shadow-sm border-2 border-sky-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-sky-800">
                        إحصائيات عامة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-sky-50 p-4 rounded-lg border border-sky-100 text-center">
                          <h3 className="text-3xl font-bold text-sky-700">
                            ١٢٠
                          </h3>
                          <p className="text-sm text-sky-600">إجمالي الطلاب</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-center">
                          <h3 className="text-3xl font-bold text-emerald-700">
                            ٨٥٪
                          </h3>
                          <p className="text-sm text-emerald-600">
                            متوسط نسبة الإنجاز
                          </p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-center">
                          <h3 className="text-3xl font-bold text-amber-700">
                            ٤.٢
                          </h3>
                          <p className="text-sm text-amber-600">
                            متوسط التقييم
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          أفضل المجموعات أداءً
                        </h3>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
                                  {i}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    مجموعة{" "}
                                    {i === 1
                                      ? "الفرقان"
                                      : i === 2
                                        ? "النور"
                                        : "الهدى"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    المعلم:{" "}
                                    {i === 1
                                      ? "محمد عبدالله"
                                      : i === 2
                                        ? "أحمد علي"
                                        : "خالد محمود"}
                                  </div>
                                </div>
                              </div>
                              <Badge
                                className={`${i === 1 ? "bg-emerald-100 text-emerald-800" : i === 2 ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800"}`}
                              >
                                {i === 1 ? "٩٢٪" : i === 2 ? "٨٨٪" : "٨٥٪"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Student Report Tab Content */}
            <TabsContent value="student" className="mt-0">
              {selectedStudent && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={handleBackToOverview}
                      className="flex items-center gap-2"
                    >
                      العودة للتقارير
                    </Button>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-sky-100 text-sky-700">
                        {selectedStudent.grade}
                      </Badge>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {selectedStudent.group}
                      </Badge>
                    </div>
                  </div>

                  <ChartDisplay
                    title={`تقرير تقدم الطالب: ${selectedStudent.name}`}
                    description="عرض تقدم الطالب في الحفظ والتلاوة خلال الفترة المحددة"
                    studentName={selectedStudent.name}
                    chartType="bar"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartDisplay
                      title="تقييمات التلاوة والحفظ"
                      description="متوسط تقييمات التلاوة والحفظ على مدار الفترة"
                      chartType="line"
                      className="h-full"
                    />

                    <ChartDisplay
                      title="توزيع التقييمات"
                      description="توزيع تقييمات الطالب حسب المستوى"
                      chartType="pie"
                      className="h-full"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Group Report Tab Content */}
            <TabsContent value="group" className="mt-0">
              {selectedGroup && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={handleBackToOverview}
                      className="flex items-center gap-2"
                    >
                      العودة للتقارير
                    </Button>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-700">
                        {selectedGroup.studentsCount} طالب
                      </Badge>
                      <Badge className="bg-sky-100 text-sky-700">
                        المعلم: {selectedGroup.teacher}
                      </Badge>
                    </div>
                  </div>

                  <ChartDisplay
                    title={`تقرير أداء مجموعة: ${selectedGroup.name}`}
                    description="عرض متوسط أداء المجموعة في الحفظ والتلاوة"
                    chartType="bar"
                  />

                  <Card className="w-full bg-white shadow-sm border border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-gray-800">
                        قائمة طلاب المجموعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative mb-4">
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="بحث عن طالب..."
                          className="pr-10 text-right"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                                {i}
                              </div>
                              <div>
                                <div className="font-medium">طالب {i}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500 rounded-full"
                                      style={{
                                        width: `${65 + Math.floor(Math.random() * 30)}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-700">
                                    {65 + Math.floor(Math.random() * 30)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-sky-700 border-sky-200 hover:bg-sky-100"
                              onClick={() =>
                                handleStudentSelect({
                                  id: `s${i}`,
                                  name: `طالب ${i}`,
                                  grade: "الصف الخامس",
                                  group: selectedGroup.name,
                                })
                              }
                            >
                              عرض التقرير
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Islamic Pattern Decoration */}
        <div className="mt-8 opacity-10">
          <div className="h-24 w-full bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000')] bg-repeat-x bg-contain" />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
