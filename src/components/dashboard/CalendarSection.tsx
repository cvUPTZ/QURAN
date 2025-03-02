import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  date: Date;
  title: string;
  type: "islamic" | "academic" | "general";
}

interface CalendarSectionProps {
  events?: Event[];
  title?: string;
}

const CalendarSection = ({
  events = [
    {
      date: new Date(2023, 9, 15),
      title: "بداية الفصل الدراسي",
      type: "academic",
    },
    {
      date: new Date(2023, 9, 27),
      title: "المولد النبوي الشريف",
      type: "islamic",
    },
    {
      date: new Date(2023, 10, 5),
      title: "اختبار الحفظ الشهري",
      type: "academic",
    },
    { date: new Date(2023, 10, 12), title: "مسابقة التجويد", type: "academic" },
    {
      date: new Date(2023, 10, 20),
      title: "اجتماع أولياء الأمور",
      type: "general",
    },
  ],
  title = "التقويم الهجري/الميلادي",
}: CalendarSectionProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Function to convert Gregorian date to Hijri (simplified mock implementation)
  const getHijriDate = (date: Date): string => {
    // This is a simplified mock implementation
    // In a real app, you would use a proper Hijri calendar library
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = 1445; // Mock Hijri year

    const hijriMonths = [
      "محرم",
      "صفر",
      "ربيع الأول",
      "ربيع الثاني",
      "جمادى الأولى",
      "جمادى الآخرة",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة",
    ];

    // Simple offset calculation (not accurate, just for demonstration)
    const hijriDay = (day + 10) % 30 || 30;
    const hijriMonthIndex = (month + 1) % 12;

    return `${hijriDay} ${hijriMonths[hijriMonthIndex]} ${year}`;
  };

  // Get events for the selected date
  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Function to get badge color based on event type
  const getEventBadgeColor = (type: Event["type"]): string => {
    switch (type) {
      case "islamic":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "academic":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "general":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden border-2 border-emerald-100 shadow-md">
      <CardHeader className="bg-emerald-50 border-b border-emerald-100">
        <CardTitle className="text-xl font-bold text-emerald-800 flex items-center justify-between rtl">
          <CalendarIcon className="h-5 w-5 ml-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Hijri date display */}
          <div className="text-center p-2 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-sm text-emerald-700 font-semibold">
              {selectedDate
                ? getHijriDate(selectedDate)
                : getHijriDate(new Date())}
            </p>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-lg border border-gray-100 p-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mx-auto"
              classNames={{
                day_selected:
                  "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white",
                day_today: "bg-emerald-100 text-emerald-900",
                caption:
                  "flex justify-center pt-1 relative items-center text-emerald-800",
                nav_button: "h-7 w-7 bg-emerald-50 p-0 hover:bg-emerald-100",
                table: "w-full border-collapse space-y-1 font-arabic",
              }}
              components={{
                IconLeft: () => <ChevronRight className="h-4 w-4" />,
                IconRight: () => <ChevronLeft className="h-4 w-4" />,
              }}
            />
          </div>

          {/* Events for selected date */}
          <div className="mt-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 text-right">
              أحداث اليوم
            </h4>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDateEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md border border-gray-100 bg-white"
                  >
                    <Badge
                      className={`${getEventBadgeColor(event.type)} text-xs`}
                    >
                      {event.type === "islamic"
                        ? "ديني"
                        : event.type === "academic"
                          ? "دراسي"
                          : "عام"}
                    </Badge>
                    <span className="text-sm font-medium text-gray-700">
                      {event.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center p-2 bg-gray-50 rounded-md">
                لا توجد أحداث لهذا اليوم
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSection;
