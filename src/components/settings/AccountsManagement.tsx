import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  UserPlus,
  MoreVertical,
  Edit,
  Trash2,
  UserCog,
  Shield,
  Mail,
  Phone,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "teacher" | "assistant" | "parent";
  status: "active" | "inactive" | "pending";
  avatar?: string;
  lastActive?: string;
}

interface AccountsManagementProps {
  users?: User[];
}

const AccountsManagement = ({ users = [] }: AccountsManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Default users if none provided
  const defaultUsers: User[] = [
    {
      id: "1",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "0501234567",
      role: "admin",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
      lastActive: "منذ ساعة",
    },
    {
      id: "2",
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "0551234567",
      role: "teacher",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
      lastActive: "منذ يومين",
    },
    {
      id: "3",
      name: "محمد عبدالله",
      email: "mohammed@example.com",
      phone: "0561234567",
      role: "teacher",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed",
      lastActive: "اليوم",
    },
    {
      id: "4",
      name: "نورة سعد",
      email: "noura@example.com",
      phone: "0571234567",
      role: "assistant",
      status: "inactive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura",
      lastActive: "منذ أسبوع",
    },
    {
      id: "5",
      name: "خالد عمر",
      email: "khalid@example.com",
      phone: "0581234567",
      role: "parent",
      status: "pending",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khalid",
      lastActive: "لم يسجل دخول بعد",
    },
  ];

  const displayUsers = users.length > 0 ? users : defaultUsers;

  // Filter users based on search query and filters
  const filteredUsers = displayUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "teacher":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "assistant":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "parent":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleInArabic = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "مدير";
      case "teacher":
        return "معلم";
      case "assistant":
        return "مساعد";
      case "parent":
        return "ولي أمر";
      default:
        return role;
    }
  };

  const getStatusInArabic = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "نشط";
      case "inactive":
        return "غير نشط";
      case "pending":
        return "معلق";
      default:
        return status;
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsAddUserOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    // Placeholder for delete functionality
    console.log(`Deleting user: ${selectedUser?.name}`);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Card className="w-full bg-white shadow-sm border-2 border-gray-100">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">
              إدارة الحسابات
            </CardTitle>
            <CardDescription className="text-gray-600">
              إضافة وتعديل وحذف حسابات المستخدمين وتحديد صلاحياتهم
            </CardDescription>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="ml-2 h-4 w-4" />
                إضافة مستخدم
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {selectedUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
                </DialogTitle>
                <DialogDescription>
                  {selectedUser
                    ? "قم بتعديل بيانات المستخدم أدناه"
                    : "قم بإدخال بيانات المستخدم الجديد"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right col-span-1">
                    الاسم
                  </Label>
                  <Input
                    id="name"
                    defaultValue={selectedUser?.name || ""}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right col-span-1">
                    البريد
                  </Label>
                  <Input
                    id="email"
                    defaultValue={selectedUser?.email || ""}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right col-span-1">
                    الجوال
                  </Label>
                  <Input
                    id="phone"
                    defaultValue={selectedUser?.phone || ""}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right col-span-1">
                    الدور
                  </Label>
                  <Select defaultValue={selectedUser?.role || "teacher"}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر الدور" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">مدير</SelectItem>
                      <SelectItem value="teacher">معلم</SelectItem>
                      <SelectItem value="assistant">مساعد</SelectItem>
                      <SelectItem value="parent">ولي أمر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right col-span-1">
                    الحالة
                  </Label>
                  <Select defaultValue={selectedUser?.status || "active"}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                      <SelectItem value="pending">معلق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="flex flex-row-reverse sm:justify-start">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {selectedUser ? "حفظ التغييرات" : "إضافة المستخدم"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddUserOpen(false);
                    setSelectedUser(null);
                  }}
                >
                  إلغاء
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="بحث عن مستخدم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-10 w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="فلترة حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
                <SelectItem value="teacher">معلم</SelectItem>
                <SelectItem value="assistant">مساعد</SelectItem>
                <SelectItem value="parent">ولي أمر</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">معلومات الاتصال</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">آخر نشاط</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="ml-1 h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="ml-1 h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleInArabic(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {getStatusInArabic(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.lastActive || "غير معروف"}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">فتح القائمة</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>خيارات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <UserCog className="h-4 w-4" />
                            إدارة الصلاحيات
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            إعادة تعيين كلمة المرور
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog
                            open={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                          >
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user)}
                                className="flex items-center gap-2 text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  هل أنت متأكد من حذف هذا المستخدم؟
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيتم حذف حساب {selectedUser?.name} نهائياً.
                                  هذا الإجراء لا يمكن التراجع عنه.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-row-reverse sm:justify-start">
                                <AlertDialogAction
                                  onClick={confirmDeleteUser}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  حذف
                                </AlertDialogAction>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-500"
                  >
                    لا توجد نتائج مطابقة للبحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsManagement;
