import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mic,
  PauseCircle,
  AlertCircle,
  BookOpen,
  Repeat,
  MessageSquare,
  Check,
  X,
} from "lucide-react";

interface RecitationToolbarProps {
  isRecording?: boolean;
  onToggleRecording?: () => void;
  onMarkError?: (errorType: string, ayahNumber: number) => void;
  selectedAyah?: number | null;
}

const RecitationToolbar = ({
  isRecording = false,
  onToggleRecording = () => {},
  onMarkError = () => {},
  selectedAyah = null,
}: RecitationToolbarProps) => {
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);

  const errorTypes = [
    {
      id: "pronunciation",
      label: "خطأ نطق",
      icon: <X className="h-3 w-3" />,
      color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
    },
    {
      id: "tajweed",
      label: "خطأ تجويد",
      icon: <AlertCircle className="h-3 w-3" />,
      color:
        "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
    },
    {
      id: "memorization",
      label: "خطأ حفظ",
      icon: <BookOpen className="h-3 w-3" />,
      color: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
    },
    {
      id: "repetition",
      label: "تكرار",
      icon: <Repeat className="h-3 w-3" />,
      color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
    },
  ];

  const handleMarkError = (errorType: string) => {
    if (selectedAyah) {
      onMarkError(errorType, selectedAyah);
      console.log(`Marked error: ${errorType} in ayah ${selectedAyah}`);
    } else {
      alert("الرجاء تحديد الآية أولاً");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Main recording button */}
      <Button
        variant={isRecording ? "destructive" : "default"}
        size="sm"
        className={`rounded-full shadow-lg ${isRecording ? "animate-pulse" : "bg-emerald-600 hover:bg-emerald-700"}`}
        onClick={onToggleRecording}
      >
        {isRecording ? (
          <>
            <PauseCircle className="h-4 w-4 mr-1" />
            <span>إيقاف التسجيل</span>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-1" />
            <span>بدء تسجيل الملاحظات</span>
          </>
        )}
      </Button>

      {/* Quick error marking buttons (only visible when recording) */}
      {isRecording && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-64">
          <div className="flex justify-between items-center mb-2">
            <Badge
              variant="outline"
              className="bg-emerald-100 text-emerald-800"
            >
              {selectedAyah ? `الآية ${selectedAyah}` : "لم يتم تحديد آية"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setQuickNoteOpen(!quickNoteOpen)}
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {errorTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                size="sm"
                className={`${type.color} text-xs justify-start h-8`}
                onClick={() => handleMarkError(type.id)}
                disabled={!selectedAyah}
              >
                {type.icon}
                <span className="ml-1">{type.label}</span>
              </Button>
            ))}
          </div>

          {quickNoteOpen && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <textarea
                className="w-full text-xs p-2 border rounded-md h-16 text-right"
                placeholder="أضف ملاحظة سريعة هنا..."
              />
              <div className="flex justify-end mt-1">
                <Button size="sm" className="h-6 text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  <span>حفظ</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecitationToolbar;
