import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  LineChart,
  PieChart,
  Download,
  Share2,
  Printer,
  FileText,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

interface ChartDisplayProps {
  title?: string;
  description?: string;
  chartData?: ChartData;
  chartType?: "bar" | "line" | "pie";
  timeRange?: string;
  studentName?: string;
  className?: string;
}

const ChartDisplay = ({
  title = "تقرير تقدم الطالب",
  description = "عرض تقدم الطالب في الحفظ والتلاوة خلال الفترة المحددة",
  chartType = "bar",
  timeRange = "شهر",
  studentName = "أحمد محمد",
  className = "",
}: ChartDisplayProps) => {
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "pie">(
    chartType,
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Mock data for charts
  const mockBarChartData: ChartData = {
    labels: ["الأسبوع 1", "الأسبوع 2", "الأسبوع 3", "الأسبوع 4"],
    datasets: [
      {
        label: "الحفظ (صفحات)",
        data: [5, 7, 4, 8],
        backgroundColor: ["rgba(16, 185, 129, 0.7)"],
        borderColor: "rgb(16, 185, 129)",
      },
      {
        label: "المراجعة (صفحات)",
        data: [12, 15, 10, 18],
        backgroundColor: ["rgba(14, 165, 233, 0.7)"],
        borderColor: "rgb(14, 165, 233)",
      },
    ],
  };

  const mockLineChartData: ChartData = {
    labels: ["الأسبوع 1", "الأسبوع 2", "الأسبوع 3", "الأسبوع 4"],
    datasets: [
      {
        label: "تقييم التلاوة",
        data: [3.5, 4.0, 3.8, 4.5],
        borderColor: "rgb(16, 185, 129)",
        fill: false,
      },
      {
        label: "تقييم الحفظ",
        data: [3.0, 3.5, 3.2, 4.2],
        borderColor: "rgb(245, 158, 11)",
        fill: false,
      },
    ],
  };

  const mockPieChartData: ChartData = {
    labels: ["ممتاز", "جيد جداً", "جيد", "مقبول"],
    datasets: [
      {
        label: "توزيع التقييمات",
        data: [15, 8, 5, 2],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(14, 165, 233, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
      },
    ],
  };

  // Render chart based on type
  const renderChart = () => {
    // In a real implementation, this would use a charting library like Chart.js or Recharts
    // For this UI scaffolding, we'll just show a placeholder

    let chartData: ChartData;
    let chartIcon: React.ReactNode;

    switch (activeChart) {
      case "bar":
        chartData = mockBarChartData;
        chartIcon = <BarChart className="h-5 w-5" />;
        break;
      case "line":
        chartData = mockLineChartData;
        chartIcon = <LineChart className="h-5 w-5" />;
        break;
      case "pie":
        chartData = mockPieChartData;
        chartIcon = <PieChart className="h-5 w-5" />;
        break;
      default:
        chartData = mockBarChartData;
        chartIcon = <BarChart className="h-5 w-5" />;
    }

    return (
      <div className="relative h-[400px] w-full bg-slate-50 rounded-md border border-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">{chartIcon}</div>
          <p className="text-muted-foreground mb-2">
            {activeChart === "bar" && "رسم بياني شريطي لتقدم الطالب"}
            {activeChart === "line" && "رسم بياني خطي لتقييمات الطالب"}
            {activeChart === "pie" && "رسم بياني دائري لتوزيع التقييمات"}
          </p>
          <p className="text-xs text-muted-foreground">
            يتم هنا عرض الرسم البياني باستخدام مكتبة الرسوم البيانية
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card
      className={`w-full bg-white shadow-sm ${className}`}
      style={{ direction: "rtl" }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-emerald-800">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            {studentName && (
              <p className="text-sm font-medium mt-1">
                الطالب: <span className="text-emerald-700">{studentName}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedTimeRange}
              onValueChange={setSelectedTimeRange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="اختر الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">أسبوع</SelectItem>
                <SelectItem value="month">شهر</SelectItem>
                <SelectItem value="quarter">ربع سنة</SelectItem>
                <SelectItem value="year">سنة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Tabs
            value={activeChart}
            onValueChange={(value) =>
              setActiveChart(value as "bar" | "line" | "pie")
            }
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>شريطي</span>
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>خطي</span>
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>دائري</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bar">{renderChart()}</TabsContent>
            <TabsContent value="line">{renderChart()}</TabsContent>
            <TabsContent value="pie">{renderChart()}</TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs">الحفظ</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-sky-500"></div>
              <span className="text-xs">المراجعة</span>
            </div>
            {activeChart === "pie" && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs">جيد</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">مقبول</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تنزيل التقرير</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>طباعة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تصدير PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>مشاركة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartDisplay;
