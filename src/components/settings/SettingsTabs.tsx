import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Users, BookOpen, Settings } from "lucide-react";

interface SettingsTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
}

const SettingsTabs = ({
  activeTab = "interface",
  onTabChange = () => {},
  tabs = [
    {
      id: "interface",
      label: "واجهة التطبيق",
      icon: <Palette className="h-4 w-4 ml-2" />,
    },
    {
      id: "accounts",
      label: "إدارة الحسابات",
      icon: <Users className="h-4 w-4 ml-2" />,
    },
    {
      id: "classes",
      label: "الفصول والمجموعات",
      icon: <BookOpen className="h-4 w-4 ml-2" />,
    },
    {
      id: "general",
      label: "إعدادات عامة",
      icon: <Settings className="h-4 w-4 ml-2" />,
    },
  ],
}: SettingsTabsProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
      <Tabs
        defaultValue={activeTab}
        onValueChange={onTabChange}
        className="w-full"
        dir="rtl"
      >
        <TabsList className="w-full justify-start bg-emerald-50 p-1 rounded-md border border-emerald-100">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SettingsTabs;
