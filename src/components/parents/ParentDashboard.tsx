import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Calendar,
  MessageSquare,
  Bell,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Send,
} from "lucide-react";

interface ParentDashboardProps {
  children?: React.ReactNode[];
  onNavigateBack?: () => void;
}

const ParentDashboard = ({
  children = [],
  onNavigateBack = () => {},
}: ParentDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedChild, setSelectedChild] = useState(0);

  // Mock data for children
  const children = [
    {
      id: "1",
      name: "أحمد محمد",
      age: 10,
      grade: "الصف الخامس",
      group: "مجموعة الفرقان",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
      attendance: 90,
      progress: 75,
      lastEvaluation: 4.2,
      nextSession: "الأحد، 10:00 صباحاً",
      assignments: [
        {
          id: "a1",
          title: "حفظ سورة البقرة (1-5)",
          status: "completed",
          dueDate: "أمس",
        },
        {
          id: "a2",
          title: "مراجعة سورة الفاتحة",
          status: "pending",
          dueDate: "اليوم",
        },
        {
          id: "a3",
          title: "حفظ سورة البقرة (6-10)",
          status: "upcoming",
          dueDate: "غداً",
        },
      ],
      notifications: [
        {
          id: "n1",
          title: "تم تقييم الحفظ",
          message: "حصل أحمد على تقييم ممتاز في حفظ سورة الفاتحة",
          time: "منذ ساعتين",
          read: false,
        },
        {
          id: "n2",
          title: "تغيير موعد الحصة",
          message: "تم تغيير موعد حصة يوم الثلاثاء إلى الساعة 11:00 صباحاً",
          time: "منذ يوم",
          read: true,
        },
      ],
    },
    {
      id: "2",
      name: "سارة محمد",
      age: 8,
      grade: "الصف الثالث",
      group: "مجموعة النور",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
      attendance: 95,
      progress: 80,
      lastEvaluation: 4.5,
      nextSession: "الإثنين، 4:00 مساءً",
      assignments: [
        {
          id: "a4",
          title: "حفظ سورة الناس",
          status: "completed",
          dueDate: "أمس",
        },
        {
          id: "a5",
          title: "مراجعة المعوذتين",
          status: "pending",
          dueDate: "اليوم",
        },
      ],
      notifications: [
        {
          id: "n3",
          title: "غياب",
          message: "تغيبت سارة عن حصة اليوم",
          time: "منذ 3 أيام",
          read: true,
        },
      ],
    },
  ];

  const selectedChildData = children[selectedChild];

  // Progress chart data (simplified for this example)
  const progressData = [
    { month: "يناير", pages: 10 },
    { month: "فبراير", pages: 15 },
    { month: "مارس", pages: 12 },
    { month: "أبريل", pages: 20 },
    { month: "مايو", pages: 25 },
  ];

  // Render progress chart (simplified)
  const renderProgressChart = () => (
    <div className="h-40 flex items-end justify-between gap-2 mt-4 px-2">
      {progressData.map((data, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="w-10 bg-emerald-500 rounded-t-md"
            style={{ height: `${data.pages * 4}px` }}
          />
          <span className="text-xs mt-1">{data.month}</span>
        </div>
      ))}
    </div>
  );

  // Render assignment status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            مكتمل
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            قيد التنفيذ
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            قادم
          </Badge>
        );
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-[#f8f7f2] islamic-pattern p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold text-gray-800 font-amiri">
              بوابة أولياء الأمور
            </h1>
            <p className="text-gray-600">
              متابعة تقدم أبنائك في حفظ وتلاوة القرآن الكريم
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onNavigateBack}
          >
            <ChevronLeft className="h-4 w-4" />
            العودة
          </Button>
        </div>

        {/* Child Selector */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">اختر الطالب</h2>
          <div className="flex flex-wrap gap-3">
            {children.map((child, index) => (
              <div
                key={child.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedChild === index ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30"}`}
                onClick={() => setSelectedChild(index)}
              >
                <Avatar>
                  <AvatarImage src={child.avatar} alt={child.name} />
                  <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{child.name}</p>
                  <p className="text-xs text-gray-500">
                    {child.grade} - {child.group}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>الواجبات</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>التواصل</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>التقارير</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">الإحصائيات السريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-emerald-700">
                            نسبة الحضور
                          </p>
                          <p className="text-2xl font-bold text-emerald-800">
                            {selectedChildData.attendance}%
                          </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="w-full h-2 bg-emerald-200 rounded-full mt-2">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${selectedChildData.attendance}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-blue-700">نسبة التقدم</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {selectedChildData.progress}%
                          </p>
                        </div>
                        <BookOpen className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="w-full h-2 bg-blue-200 rounded-full mt-2">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${selectedChildData.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-amber-700">آخر تقييم</p>
                          <p className="text-2xl font-bold text-amber-800">
                            {selectedChildData.lastEvaluation}
                          </p>
                        </div>
                        <Star className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= Math.floor(selectedChildData.lastEvaluation) ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      تقدم الحفظ (عدد الصفحات شهرياً)
                    </h3>
                    {renderProgressChart()}
                  </div>
                </CardContent>
              </Card>

              {/* Next Session */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">الحصة القادمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center">
                    <Calendar className="h-12 w-12 text-blue-500 mb-2" />
                    <p className="text-lg font-bold text-blue-800">
                      {selectedChildData.nextSession}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      مع الأستاذ محمد أحمد
                    </p>
                    <p className="text-xs text-blue-500 mt-4">
                      المقرر: سورة البقرة (الآيات 1-10)
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">
                      آخر الإشعارات
                    </h3>
                    <div className="space-y-3">
                      {selectedChildData.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${notification.read ? "bg-gray-50 border-gray-200" : "bg-amber-50 border-amber-200"}`}
                        >
                          <div className="flex justify-between">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-500">
                              {notification.time}
                            </p>
                          </div>
                          <p className="text-sm mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>واجبات الطالب {selectedChildData.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      الواجبات الحالية
                    </h3>
                    <div className="space-y-3">
                      {selectedChildData.assignments
                        .filter((a) => a.status === "pending")
                        .map((assignment) => (
                          <div
                            key={assignment.id}
                            className="p-4 rounded-lg border border-amber-200 bg-amber-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-amber-600" />
                                  <h4 className="font-medium">
                                    {assignment.title}
                                  </h4>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  موعد التسليم: {assignment.dueDate}
                                </p>
                              </div>
                              {renderStatusBadge(assignment.status)}
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                تفاصيل الواجب
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      الواجبات القادمة
                    </h3>
                    <div className="space-y-3">
                      {selectedChildData.assignments
                        .filter((a) => a.status === "upcoming")
                        .map((assignment) => (
                          <div
                            key={assignment.id}
                            className="p-4 rounded-lg border border-blue-200 bg-blue-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <h4 className="font-medium">
                                    {assignment.title}
                                  </h4>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  موعد التسليم: {assignment.dueDate}
                                </p>
                              </div>
                              {renderStatusBadge(assignment.status)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      الواجبات المكتملة
                    </h3>
                    <div className="space-y-3">
                      {selectedChildData.assignments
                        .filter((a) => a.status === "completed")
                        .map((assignment) => (
                          <div
                            key={assignment.id}
                            className="p-4 rounded-lg border border-emerald-200 bg-emerald-50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-emerald-600" />
                                  <h4 className="font-medium">
                                    {assignment.title}
                                  </h4>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  تم التسليم: {assignment.dueDate}
                                </p>
                              </div>
                              {renderStatusBadge(assignment.status)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>التواصل مع المعلمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b">
                      <h3 className="font-medium">المحادثات</h3>
                    </div>
                    <div className="divide-y">
                      <div className="p-3 bg-emerald-50 border-r-4 border-emerald-500">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1"
                              alt="محمد أحمد"
                            />
                            <AvatarFallback>م أ</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">محمد أحمد</p>
                            <p className="text-xs text-gray-500">معلم القرآن</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2"
                              alt="خالد محمود"
                            />
                            <AvatarFallback>خ م</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">خالد محمود</p>
                            <p className="text-xs text-gray-500">مشرف الحلقة</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                              alt="إدارة المدرسة"
                            />
                            <AvatarFallback>إ م</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">إدارة المدرسة</p>
                            <p className="text-xs text-gray-500">
                              إشعارات وتنبيهات
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col h-[500px]">
                    <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1"
                            alt="محمد أحمد"
                          />
                          <AvatarFallback>م أ</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">محمد أحمد</p>
                          <p className="text-xs text-gray-500">
                            آخر ظهور: منذ 30 دقيقة
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">
                            السلام عليكم، أود إبلاغكم بأن أحمد أظهر تقدماً
                            ملحوظاً في حفظ سورة البقرة هذا الأسبوع.
                          </p>
                          <p className="text-xs text-gray-500 mt-1 text-left">
                            10:30 ص
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-emerald-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">
                            وعليكم السلام، شكراً جزيلاً على المتابعة. هل هناك
                            تمارين إضافية يمكننا العمل عليها في المنزل؟
                          </p>
                          <p className="text-xs text-gray-500 mt-1 text-left">
                            10:35 ص
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">
                            نعم، أنصح بمراجعة الآيات 1-10 من سورة البقرة يومياً،
                            والتركيز على مخارج الحروف خاصة في الآيات 6-7.
                          </p>
                          <p className="text-xs text-gray-500 mt-1 text-left">
                            10:40 ص
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">
                            كما أرفقت لكم تسجيلاً صوتياً للآيات لتساعدوه في
                            المراجعة.
                          </p>
                          <div className="mt-2 bg-white p-2 rounded border flex items-center gap-2">
                            <div className="bg-emerald-100 p-1 rounded">
                              <BookOpen className="h-4 w-4 text-emerald-700" />
                            </div>
                            <span className="text-xs">
                              تسجيل_سورة_البقرة.mp3
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 ml-auto"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-left">
                            10:42 ص
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div className="bg-emerald-100 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">
                            شكراً جزيلاً، سنعمل على ذلك. هل يمكنكم إرسال جدول
                            المراجعة للأسبوع القادم؟
                          </p>
                          <p className="text-xs text-gray-500 mt-1 text-left">
                            10:45 ص
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border-t bg-white">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="اكتب رسالتك هنا..."
                          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>تقارير الطالب {selectedChildData.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-emerald-50 border-emerald-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-emerald-800 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span>تقرير الحضور</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-emerald-700">
                            {selectedChildData.attendance}%
                          </p>
                          <p className="text-sm text-emerald-600 mt-1">
                            نسبة الحضور
                          </p>
                          <div className="mt-4 grid grid-cols-3 text-center text-sm">
                            <div>
                              <p className="font-bold text-emerald-700">24</p>
                              <p className="text-xs text-emerald-600">حاضر</p>
                            </div>
                            <div>
                              <p className="font-bold text-red-700">2</p>
                              <p className="text-xs text-red-600">غائب</p>
                            </div>
                            <div>
                              <p className="font-bold text-amber-700">1</p>
                              <p className="text-xs text-amber-600">متأخر</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 text-xs"
                        >
                          تفاصيل الحضور
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          <span>تقرير الحفظ</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-700">30</p>
                          <p className="text-sm text-blue-600 mt-1">
                            صفحة محفوظة
                          </p>
                          <div className="mt-4 grid grid-cols-2 text-center text-sm">
                            <div>
                              <p className="font-bold text-blue-700">5</p>
                              <p className="text-xs text-blue-600">
                                صفحات هذا الشهر
                              </p>
                            </div>
                            <div>
                              <p className="font-bold text-blue-700">2</p>
                              <p className="text-xs text-blue-600">سور كاملة</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 text-xs"
                        >
                          تفاصيل الحفظ
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-amber-50 border-amber-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          <span>تقرير التقييم</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-amber-700">
                            {selectedChildData.lastEvaluation}
                          </p>
                          <p className="text-sm text-amber-600 mt-1">
                            متوسط التقييم
                          </p>
                          <div className="flex justify-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${star <= Math.floor(selectedChildData.lastEvaluation) ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <div className="mt-4 grid grid-cols-3 text-center text-sm">
                            <div>
                              <p className="font-bold text-amber-700">4.5</p>
                              <p className="text-xs text-amber-600">الحفظ</p>
                            </div>
                            <div>
                              <p className="font-bold text-amber-700">4.0</p>
                              <p className="text-xs text-amber-600">التجويد</p>
                            </div>
                            <div>
                              <p className="font-bold text-amber-700">4.2</p>
                              <p className="text-xs text-amber-600">الترتيل</p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 text-xs"
                        >
                          تفاصيل التقييم
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      التقارير الشهرية
                    </h3>
                    <div className="space-y-3">
                      {[
                        { month: "مايو 2023", date: "01/06/2023" },
                        { month: "أبريل 2023", date: "01/05/2023" },
                        { month: "مارس 2023", date: "01/04/2023" },
                      ].map((report, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border border-gray-200 bg-white flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-700" />
                            </div>
                            <div>
                              <p className="font-medium">
                                التقرير الشهري - {report.month}
                              </p>
                              <p className="text-sm text-gray-500">
                                تاريخ الإصدار: {report.date}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            تحميل
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Islamic Pattern Decoration */}
        <div className="mt-8 opacity-10">
          <div className="h-24 w-full bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000')] bg-repeat-x bg-contain" />
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
