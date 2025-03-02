import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  BookOpen,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
} from "lucide-react";

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
}

const QuickAccessCard = ({
  title = "عنوان البطاقة",
  description = "وصف البطاقة يظهر هنا",
  icon = <ClipboardList size={24} />,
  to = "/",
  color = "bg-emerald-100 text-emerald-700",
}: QuickAccessCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20">
      <CardHeader className={`${color} flex flex-row items-center gap-4`}>
        <div className="p-2 rounded-full bg-white/20">{icon}</div>
        <div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <CardDescription className="text-sm opacity-90">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-16 flex items-center justify-center">
          {/* Placeholder for additional content or stats */}
          <p className="text-center text-muted-foreground">
            اضغط للوصول السريع
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button asChild variant="outline">
          <Link to={to}>فتح</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface QuickAccessProps {
  cards?: QuickAccessCardProps[];
}

const QuickAccess = ({ cards = [] }: QuickAccessProps) => {
  // Default cards if none provided
  const defaultCards: QuickAccessCardProps[] = [
    {
      title: "تسجيل الحضور",
      description: "تسجيل حضور وغياب الطلاب",
      icon: <ClipboardList size={24} />,
      to: "/attendance",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "متابعة التلاوة والحفظ",
      description: "تقييم أداء الطلاب في التلاوة والحفظ",
      icon: <BookOpen size={24} />,
      to: "/quran-tracking",
      color: "bg-sky-100 text-sky-700",
    },
    {
      title: "التقارير البيانية",
      description: "عرض تقارير تقدم الطلاب",
      icon: <BarChart3 size={24} />,
      to: "/reports",
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "بوابة أولياء الأمور",
      description: "متابعة تقدم الأبناء في الحفظ والتلاوة",
      icon: <Users size={24} />,
      to: "/parent-dashboard",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "مركز التواصل",
      description: "التواصل مع المعلمين والإدارة",
      icon: <MessageSquare size={24} />,
      to: "/communication",
      color: "bg-rose-100 text-rose-700",
    },
    {
      title: "الإعدادات",
      description: "تخصيص التطبيق وإدارة الحسابات",
      icon: <Settings size={24} />,
      to: "/settings",
      color: "bg-purple-100 text-purple-700",
    },
  ];

  const displayCards = cards.length > 0 ? cards : defaultCards;

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border">
      <div className="mb-6 text-right">
        <h2 className="text-2xl font-bold text-gray-800">الوصول السريع</h2>
        <p className="text-gray-600">اختر إحدى الوظائف الرئيسية للتطبيق</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCards.map((card, index) => (
          <QuickAccessCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
