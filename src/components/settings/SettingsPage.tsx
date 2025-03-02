import React, { useState } from "react";
import SettingsTabs from "./SettingsTabs";
import InterfaceSettings from "./InterfaceSettings";
import AccountsManagement from "./AccountsManagement";
import ClassesManagement from "./ClassesManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Palette, Users, BookOpen, Bell } from "lucide-react";

interface SettingsPageProps {
  defaultTab?: string;
}

const SettingsPage = ({ defaultTab = "interface" }: SettingsPageProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
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
      id: "notifications",
      label: "الإشعارات",
      icon: <Bell className="h-4 w-4 ml-2" />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "interface":
        return <InterfaceSettings />;
      case "accounts":
        return <AccountsManagement />;
      case "classes":
        return <ClassesManagement />;
      case "notifications":
        return (
          <Card className="w-full bg-white shadow-sm border-2 border-gray-100">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Settings className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  إعدادات الإشعارات
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  هذه الميزة قيد التطوير وستكون متاحة قريباً. ستتمكن من تخصيص
                  إشعارات التطبيق وتنبيهات النظام.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <InterfaceSettings />;
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-[#f8f7f2] p-6"
      style={{ direction: "rtl" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">الإعدادات</h1>
          <p className="text-gray-600">
            تخصيص التطبيق وإدارة الحسابات والفصول/المجموعات
          </p>
        </div>

        {/* Settings Tabs */}
        <SettingsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        {/* Tab Content */}
        <div className="mt-6">{renderTabContent()}</div>

        {/* Islamic Pattern Decoration */}
        <div className="mt-8 opacity-10">
          <div className="h-24 w-full bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000')] bg-repeat-x bg-contain" />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
