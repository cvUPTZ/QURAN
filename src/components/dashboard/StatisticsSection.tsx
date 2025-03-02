import React from "react";
import {
  Users,
  UserCheck,
  BookOpen,
  Star,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  color?: string;
}

const StatCard = ({
  title = "إحصائية",
  value = "0",
  description = "وصف الإحصائية",
  icon = <Users className="h-5 w-5" />,
  trend = "",
  trendDirection = "neutral",
  color = "bg-emerald-100 text-emerald-700",
}: StatCardProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="mt-1 text-xs">
          {description}
        </CardDescription>
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            {trendDirection === "up" && (
              <TrendingUp className="mr-1 h-3 w-3 text-emerald-600" />
            )}
            {trendDirection === "down" && (
              <TrendingUp className="mr-1 h-3 w-3 rotate-180 text-red-600" />
            )}
            <span
              className={`${trendDirection === "up" ? "text-emerald-600" : ""}${trendDirection === "down" ? "text-red-600" : ""}${trendDirection === "neutral" ? "text-gray-600" : ""}`}
            >
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatisticsSectionProps {
  stats?: StatCardProps[];
}

const StatisticsSection = ({ stats = [] }: StatisticsSectionProps) => {
  // Default statistics if none provided
  const defaultStats: StatCardProps[] = [
    {
      title: "إجمالي الطلاب",
      value: "١٢٠",
      description: "عدد الطلاب المسجلين",
      icon: <Users className="h-5 w-5" />,
      trend: "زيادة ٥٪ عن الشهر الماضي",
      trendDirection: "up",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "نسبة الحضور",
      value: "٨٥٪",
      description: "متوسط الحضور اليومي",
      icon: <UserCheck className="h-5 w-5" />,
      trend: "ثبات عن الأسبوع الماضي",
      trendDirection: "neutral",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "متوسط الحفظ",
      value: "٣ صفحات",
      description: "متوسط الحفظ اليومي للطالب",
      icon: <BookOpen className="h-5 w-5" />,
      trend: "زيادة صفحة عن الشهر الماضي",
      trendDirection: "up",
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "متوسط التقييم",
      value: "٤.٢",
      description: "متوسط تقييم أداء الطلاب",
      icon: <Star className="h-5 w-5" />,
      trend: "انخفاض ٠.٣ عن الشهر الماضي",
      trendDirection: "down",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "الأيام المتبقية",
      value: "١٢",
      description: "حتى نهاية الفصل الدراسي",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-rose-100 text-rose-700",
    },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div
      className="w-full bg-white p-4 rounded-xl shadow-sm"
      style={{ direction: "rtl" }}
    >
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        الإحصائيات السريعة
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {displayStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default StatisticsSection;
