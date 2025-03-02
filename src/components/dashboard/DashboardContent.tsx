import React from "react";
import StatisticsSection from "./StatisticsSection";
import CalendarSection from "./CalendarSection";
import QuranVerse from "./QuranVerse";
import QuickAccess from "./QuickAccess";

interface DashboardContentProps {
  statistics?: any[];
  events?: any[];
  verse?: {
    arabic: string;
    translation: string;
    surah: string;
    ayah: number;
    reference: string;
  };
  quickAccessCards?: any[];
}

const DashboardContent = ({
  statistics = [],
  events = [],
  verse = undefined,
  quickAccessCards = [],
}: DashboardContentProps) => {
  return (
    <div
      className="w-full min-h-screen bg-[#f8f7f2] p-6"
      style={{ direction: "rtl" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">لوحة المعلومات</h1>
          <p className="text-gray-600">مرحباً بك في مدرسة القرآن الكريم</p>
        </div>

        {/* Statistics Section */}
        <StatisticsSection stats={statistics} />

        {/* Middle Section - Calendar and Quran Verse */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <CalendarSection events={events} />
          </div>
          <div className="lg:col-span-8 flex justify-center">
            <QuranVerse verse={verse} />
          </div>
        </div>

        {/* Quick Access Section */}
        <QuickAccess cards={quickAccessCards} />

        {/* Islamic Pattern Decoration */}
        <div className="mt-8 opacity-10">
          <div className="h-24 w-full bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000')] bg-repeat-x bg-contain" />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
