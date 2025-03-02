import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  ClipboardList,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

const NavItem = ({
  to = "/",
  icon = <Home size={20} />,
  label = "الرئيسية",
  isActive = false,
  isCollapsed = false,
}: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to} className="w-full block">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 py-6",
                isActive
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                  : "hover:bg-gray-100",
                isCollapsed ? "justify-center px-2" : "px-4",
              )}
            >
              <span
                className={cn("shrink-0", isActive ? "text-emerald-700" : "")}
              >
                {icon}
              </span>
              {!isCollapsed && <span className="text-right">{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const Sidebar = ({
  isCollapsed = false,
  onToggleCollapse = () => {},
  userName = "محمد أحمد",
  userRole = "مشرف",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=islamic-app",
  isDarkMode = false,
  onToggleTheme = () => {},
}: SidebarProps) => {
  const location = useLocation();

  const navItems = [
    {
      to: "/",
      icon: <Home size={20} />,
      label: "الرئيسية",
    },
    {
      to: "/attendance",
      icon: <ClipboardList size={20} />,
      label: "تسجيل الحضور",
    },
    {
      to: "/quran-tracking",
      icon: <BookOpen size={20} />,
      label: "متابعة التلاوة والحفظ",
    },
    {
      to: "/reports",
      icon: <BarChart3 size={20} />,
      label: "التقارير البيانية",
    },
    {
      to: "/settings",
      icon: <Settings size={20} />,
      label: "الإعدادات",
    },
  ];

  return (
    <div
      className={cn(
        "h-full bg-white border-l border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[280px]",
      )}
      style={{ direction: "rtl" }}
    >
      {/* Logo and App Name */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700 font-bold text-xl">ق</span>
            </div>
            {!isCollapsed && (
              <div className="font-bold text-lg text-emerald-800">
                مدرسة القرآن الكريم
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border-2 border-emerald-200"
            />
            <div>
              <div className="font-semibold text-gray-800">{userName}</div>
              <div className="text-sm text-gray-500">{userRole}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            onClick={onToggleTheme}
            className="w-full justify-start gap-3 hover:bg-gray-100"
          >
            <span className="shrink-0">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </span>
            {!isCollapsed && (
              <span className="text-right">
                {isDarkMode ? "الوضع النهاري" : "الوضع الليلي"}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "default"}
            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <span className="shrink-0">
              <LogOut size={20} />
            </span>
            {!isCollapsed && <span className="text-right">تسجيل الخروج</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
