import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Palette, Moon, Sun, Type, Grid3X3, Check } from "lucide-react";

interface ThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface FontOption {
  id: string;
  name: string;
  value: string;
}

interface PatternOption {
  id: string;
  name: string;
  preview: string;
}

interface InterfaceSettingsProps {
  themes?: ThemeOption[];
  fonts?: FontOption[];
  patterns?: PatternOption[];
  currentTheme?: string;
  currentFont?: string;
  currentPattern?: string;
  darkMode?: boolean;
  fontSize?: number;
  onSave?: (settings: any) => void;
}

const InterfaceSettings = ({
  themes = [
    {
      id: "emerald",
      name: "أخضر زمردي",
      primaryColor: "bg-emerald-600",
      secondaryColor: "bg-emerald-100",
      accentColor: "bg-amber-400",
    },
    {
      id: "azure",
      name: "أزرق سماوي",
      primaryColor: "bg-sky-600",
      secondaryColor: "bg-sky-100",
      accentColor: "bg-amber-400",
    },
    {
      id: "royal",
      name: "أزرق ملكي",
      primaryColor: "bg-indigo-600",
      secondaryColor: "bg-indigo-100",
      accentColor: "bg-amber-400",
    },
    {
      id: "desert",
      name: "صحراوي",
      primaryColor: "bg-amber-600",
      secondaryColor: "bg-amber-100",
      accentColor: "bg-emerald-400",
    },
  ],
  fonts = [
    { id: "amiri", name: "أميري", value: "Amiri, serif" },
    { id: "cairo", name: "القاهرة", value: "Cairo, sans-serif" },
    { id: "tajawal", name: "تجوال", value: "Tajawal, sans-serif" },
    { id: "scheherazade", name: "شهرزاد", value: "Scheherazade New, serif" },
  ],
  patterns = [
    {
      id: "geometric",
      name: "هندسي",
      preview:
        "https://images.unsplash.com/photo-1582223607370-cfaf15f3a53f?w=100&h=100&fit=crop&auto=format",
    },
    {
      id: "arabesque",
      name: "عربيسك",
      preview:
        "https://images.unsplash.com/photo-1582223606736-c5cbad6ae29a?w=100&h=100&fit=crop&auto=format",
    },
    {
      id: "floral",
      name: "زخرفة نباتية",
      preview:
        "https://images.unsplash.com/photo-1582223606497-a42e3cc3f648?w=100&h=100&fit=crop&auto=format",
    },
    {
      id: "none",
      name: "بدون",
      preview:
        "https://images.unsplash.com/photo-1582223607370-cfaf15f3a53f?w=100&h=100&fit=crop&auto=format&blur=10",
    },
  ],
  currentTheme = "emerald",
  currentFont = "amiri",
  currentPattern = "geometric",
  darkMode = false,
  fontSize = 16,
  onSave = () => {},
}: InterfaceSettingsProps) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [selectedFont, setSelectedFont] = useState(currentFont);
  const [selectedPattern, setSelectedPattern] = useState(currentPattern);
  const [isDarkMode, setIsDarkMode] = useState(darkMode);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);

  const handleSave = () => {
    onSave({
      theme: selectedTheme,
      font: selectedFont,
      pattern: selectedPattern,
      darkMode: isDarkMode,
      fontSize: currentFontSize,
    });
  };

  return (
    <div
      className="w-full bg-white p-6 rounded-xl shadow-sm"
      style={{ direction: "rtl" }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">إعدادات الواجهة</h2>

      <Tabs defaultValue="theme" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>الألوان والسمات</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>الخطوط والنصوص</span>
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span>الزخارف والأنماط</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <Label htmlFor="dark-mode">الوضع الليلي</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
              </div>

              <div className="space-y-4">
                <Label>اختر السمة اللونية</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedTheme === theme.id ? "border-primary ring-2 ring-primary/20" : "border-gray-200"}`}
                      onClick={() => setSelectedTheme(theme.id)}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">{theme.name}</span>
                        {selectedTheme === theme.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div
                          className={`w-8 h-8 rounded-full ${theme.primaryColor}`}
                        ></div>
                        <div
                          className={`w-8 h-8 rounded-full ${theme.secondaryColor}`}
                        ></div>
                        <div
                          className={`w-8 h-8 rounded-full ${theme.accentColor}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="font-size">حجم الخط</Label>
                    <span className="text-sm text-gray-500">
                      {currentFontSize}px
                    </span>
                  </div>
                  <Slider
                    id="font-size"
                    min={12}
                    max={24}
                    step={1}
                    value={[currentFontSize]}
                    onValueChange={(value) => setCurrentFontSize(value[0])}
                    className="mb-6"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">نوع الخط</Label>
                  <RadioGroup
                    value={selectedFont}
                    onValueChange={setSelectedFont}
                    className="space-y-3"
                  >
                    {fonts.map((font) => (
                      <div
                        key={font.id}
                        className="flex items-center space-x-2 space-x-reverse"
                      >
                        <RadioGroupItem
                          value={font.id}
                          id={`font-${font.id}`}
                        />
                        <Label htmlFor={`font-${font.id}`} className="flex-1">
                          <div className="flex justify-between items-center">
                            <span>{font.name}</span>
                            <span
                              className="text-lg"
                              style={{ fontFamily: font.value }}
                            >
                              بسم الله الرحمن الرحيم
                            </span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Label className="mb-4 block">اختر نمط الزخرفة الإسلامية</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {patterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedPattern === pattern.id ? "border-primary ring-2 ring-primary/20" : "border-gray-200"}`}
                    onClick={() => setSelectedPattern(pattern.id)}
                  >
                    <img
                      src={pattern.preview}
                      alt={pattern.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="text-white font-medium">
                        {pattern.name}
                      </span>
                    </div>
                    {selectedPattern === pattern.id && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} className="px-6">
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default InterfaceSettings;
