import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Search,
  Plus,
  BookOpen,
  UserCheck,
  Filter,
} from "lucide-react";

interface Class {
  id: string;
  name: string;
  teacherName: string;
  studentsCount: number;
  level: string;
  status: "active" | "inactive";
}

interface Group {
  id: string;
  name: string;
  classId: string;
  className: string;
  teacherName: string;
  studentsCount: number;
  schedule: string;
  status: "active" | "inactive";
}

interface Student {
  id: string;
  name: string;
  age: number;
  parentName: string;
  phone: string;
  classId: string;
  className: string;
  groupId: string;
  groupName: string;
  level: string;
  status: "active" | "inactive";
}

interface ClassesManagementProps {
  classes?: Class[];
  groups?: Group[];
  students?: Student[];
}

const ClassesManagement = ({
  classes = [
    {
      id: "c1",
      name: "الصف الأول",
      teacherName: "أحمد محمد",
      studentsCount: 25,
      level: "مبتدئ",
      status: "active",
    },
    {
      id: "c2",
      name: "الصف الثاني",
      teacherName: "محمد علي",
      studentsCount: 20,
      level: "متوسط",
      status: "active",
    },
    {
      id: "c3",
      name: "الصف الثالث",
      teacherName: "خالد أحمد",
      studentsCount: 18,
      level: "متقدم",
      status: "active",
    },
    {
      id: "c4",
      name: "الصف الرابع",
      teacherName: "عمر محمود",
      studentsCount: 15,
      level: "مبتدئ",
      status: "inactive",
    },
  ],
  groups = [
    {
      id: "g1",
      name: "مجموعة الفجر",
      classId: "c1",
      className: "الصف الأول",
      teacherName: "أحمد محمد",
      studentsCount: 12,
      schedule: "السبت والاثنين 8:00 - 10:00",
      status: "active",
    },
    {
      id: "g2",
      name: "مجموعة الضحى",
      classId: "c1",
      className: "الصف الأول",
      teacherName: "أحمد محمد",
      studentsCount: 13,
      schedule: "الأحد والثلاثاء 10:00 - 12:00",
      status: "active",
    },
    {
      id: "g3",
      name: "مجموعة العصر",
      classId: "c2",
      className: "الصف الثاني",
      teacherName: "محمد علي",
      studentsCount: 10,
      schedule: "السبت والاثنين 14:00 - 16:00",
      status: "active",
    },
    {
      id: "g4",
      name: "مجموعة المغرب",
      classId: "c2",
      className: "الصف الثاني",
      teacherName: "محمد علي",
      studentsCount: 10,
      schedule: "الأحد والثلاثاء 16:00 - 18:00",
      status: "inactive",
    },
  ],
  students = [
    {
      id: "s1",
      name: "عبدالله محمد",
      age: 10,
      parentName: "محمد أحمد",
      phone: "0501234567",
      classId: "c1",
      className: "الصف الأول",
      groupId: "g1",
      groupName: "مجموعة الفجر",
      level: "مبتدئ",
      status: "active",
    },
    {
      id: "s2",
      name: "عمر خالد",
      age: 9,
      parentName: "خالد عمر",
      phone: "0507654321",
      classId: "c1",
      className: "الصف الأول",
      groupId: "g1",
      groupName: "مجموعة الفجر",
      level: "مبتدئ",
      status: "active",
    },
    {
      id: "s3",
      name: "أحمد علي",
      age: 11,
      parentName: "علي أحمد",
      phone: "0509876543",
      classId: "c2",
      className: "الصف الثاني",
      groupId: "g3",
      groupName: "مجموعة العصر",
      level: "متوسط",
      status: "active",
    },
    {
      id: "s4",
      name: "محمد سعيد",
      age: 10,
      parentName: "سعيد محمد",
      phone: "0503456789",
      classId: "c2",
      className: "الصف الثاني",
      groupId: "g3",
      groupName: "مجموعة العصر",
      level: "متوسط",
      status: "inactive",
    },
  ],
}: ClassesManagementProps) => {
  const [activeTab, setActiveTab] = useState("classes");
  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false);
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter functions
  const filteredClasses = classes.filter(
    (cls) =>
      (filterStatus === "all" ||
        (filterStatus === "active" && cls.status === "active") ||
        (filterStatus === "inactive" && cls.status === "inactive")) &&
      (cls.name.includes(searchTerm) ||
        cls.teacherName.includes(searchTerm) ||
        cls.level.includes(searchTerm)),
  );

  const filteredGroups = groups.filter(
    (group) =>
      (filterStatus === "all" ||
        (filterStatus === "active" && group.status === "active") ||
        (filterStatus === "inactive" && group.status === "inactive")) &&
      (group.name.includes(searchTerm) ||
        group.className.includes(searchTerm) ||
        group.teacherName.includes(searchTerm) ||
        group.schedule.includes(searchTerm)),
  );

  const filteredStudents = students.filter(
    (student) =>
      (filterStatus === "all" ||
        (filterStatus === "active" && student.status === "active") ||
        (filterStatus === "inactive" && student.status === "inactive")) &&
      (student.name.includes(searchTerm) ||
        student.parentName.includes(searchTerm) ||
        student.className.includes(searchTerm) ||
        student.groupName.includes(searchTerm)),
  );

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm" dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          إدارة الفصول والمجموعات
        </h2>
        <p className="text-gray-600">
          إنشاء وتعديل وحذف الفصول والمجموعات وتوزيع الطلاب عليها
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="بحث..."
            className="pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            الفصول
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            المجموعات
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            الطلاب
          </TabsTrigger>
        </TabsList>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>الفصول الدراسية</CardTitle>
                <Dialog
                  open={isAddClassDialogOpen}
                  onOpenChange={setIsAddClassDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة فصل
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة فصل جديد</DialogTitle>
                      <DialogDescription>
                        أدخل معلومات الفصل الجديد هنا. اضغط حفظ عند الانتهاء.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="className"
                          className="text-right col-span-1"
                        >
                          اسم الفصل
                        </Label>
                        <Input
                          id="className"
                          placeholder="أدخل اسم الفصل"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="teacherName"
                          className="text-right col-span-1"
                        >
                          المعلم
                        </Label>
                        <Input
                          id="teacherName"
                          placeholder="أدخل اسم المعلم"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="level"
                          className="text-right col-span-1"
                        >
                          المستوى
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر المستوى" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">مبتدئ</SelectItem>
                            <SelectItem value="intermediate">متوسط</SelectItem>
                            <SelectItem value="advanced">متقدم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="status"
                          className="text-right col-span-1"
                        >
                          الحالة
                        </Label>
                        <Select defaultValue="active">
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="inactive">غير نشط</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">حفظ</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                إدارة الفصول الدراسية والمعلمين المسؤولين عنها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الفصل</TableHead>
                    <TableHead className="text-right">المعلم</TableHead>
                    <TableHead className="text-right">عدد الطلاب</TableHead>
                    <TableHead className="text-right">المستوى</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">
                          {cls.name}
                        </TableCell>
                        <TableCell>{cls.teacherName}</TableCell>
                        <TableCell>{cls.studentsCount}</TableCell>
                        <TableCell>{cls.level}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              cls.status === "active" ? "default" : "secondary"
                            }
                            className={
                              cls.status === "active"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {cls.status === "active" ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent dir="rtl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    هل أنت متأكد؟
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    سيتم حذف الفصل وجميع المجموعات والطلاب
                                    المرتبطين به. هذا الإجراء لا يمكن التراجع
                                    عنه.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        لا توجد فصول مطابقة لمعايير البحث
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>المجموعات</CardTitle>
                <Dialog
                  open={isAddGroupDialogOpen}
                  onOpenChange={setIsAddGroupDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة مجموعة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة مجموعة جديدة</DialogTitle>
                      <DialogDescription>
                        أدخل معلومات المجموعة الجديدة هنا. اضغط حفظ عند
                        الانتهاء.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="groupName"
                          className="text-right col-span-1"
                        >
                          اسم المجموعة
                        </Label>
                        <Input
                          id="groupName"
                          placeholder="أدخل اسم المجموعة"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="class"
                          className="text-right col-span-1"
                        >
                          الفصل
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر الفصل" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="schedule"
                          className="text-right col-span-1"
                        >
                          الجدول
                        </Label>
                        <Input
                          id="schedule"
                          placeholder="أدخل جدول المجموعة"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="status"
                          className="text-right col-span-1"
                        >
                          الحالة
                        </Label>
                        <Select defaultValue="active">
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="inactive">غير نشط</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">حفظ</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                إدارة مجموعات الطلاب داخل الفصول الدراسية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم المجموعة</TableHead>
                    <TableHead className="text-right">الفصل</TableHead>
                    <TableHead className="text-right">المعلم</TableHead>
                    <TableHead className="text-right">عدد الطلاب</TableHead>
                    <TableHead className="text-right">الجدول</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">
                          {group.name}
                        </TableCell>
                        <TableCell>{group.className}</TableCell>
                        <TableCell>{group.teacherName}</TableCell>
                        <TableCell>{group.studentsCount}</TableCell>
                        <TableCell>{group.schedule}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              group.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              group.status === "active"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {group.status === "active" ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent dir="rtl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    هل أنت متأكد؟
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    سيتم حذف المجموعة وإزالة جميع الطلاب منها.
                                    هذا الإجراء لا يمكن التراجع عنه.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        لا توجد مجموعات مطابقة لمعايير البحث
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>الطلاب</CardTitle>
                <Dialog
                  open={isAddStudentDialogOpen}
                  onOpenChange={setIsAddStudentDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      إضافة طالب
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة طالب جديد</DialogTitle>
                      <DialogDescription>
                        أدخل معلومات الطالب الجديد هنا. اضغط حفظ عند الانتهاء.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="studentName"
                          className="text-right col-span-1"
                        >
                          اسم الطالب
                        </Label>
                        <Input
                          id="studentName"
                          placeholder="أدخل اسم الطالب"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="age" className="text-right col-span-1">
                          العمر
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="أدخل عمر الطالب"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="parentName"
                          className="text-right col-span-1"
                        >
                          ولي الأمر
                        </Label>
                        <Input
                          id="parentName"
                          placeholder="أدخل اسم ولي الأمر"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="phone"
                          className="text-right col-span-1"
                        >
                          رقم الهاتف
                        </Label>
                        <Input
                          id="phone"
                          placeholder="أدخل رقم الهاتف"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="class"
                          className="text-right col-span-1"
                        >
                          الفصل
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر الفصل" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((cls) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="group"
                          className="text-right col-span-1"
                        >
                          المجموعة
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر المجموعة" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups.map((group) => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="level"
                          className="text-right col-span-1"
                        >
                          المستوى
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر المستوى" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">مبتدئ</SelectItem>
                            <SelectItem value="intermediate">متوسط</SelectItem>
                            <SelectItem value="advanced">متقدم</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="status"
                          className="text-right col-span-1"
                        >
                          الحالة
                        </Label>
                        <Select defaultValue="active">
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="inactive">غير نشط</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">حفظ</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                إدارة الطلاب وتوزيعهم على الفصول والمجموعات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم الطالب</TableHead>
                    <TableHead className="text-right">العمر</TableHead>
                    <TableHead className="text-right">ولي الأمر</TableHead>
                    <TableHead className="text-right">الفصل</TableHead>
                    <TableHead className="text-right">المجموعة</TableHead>
                    <TableHead className="text-right">المستوى</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell>{student.parentName}</TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>{student.groupName}</TableCell>
                        <TableCell>{student.level}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              student.status === "active"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {student.status === "active" ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent dir="rtl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    هل أنت متأكد؟
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    سيتم حذف الطالب من النظام. هذا الإجراء لا
                                    يمكن التراجع عنه.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        لا يوجد طلاب مطابقين لمعايير البحث
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassesManagement;
