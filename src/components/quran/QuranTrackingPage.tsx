import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Save, ArrowLeft } from "lucide-react";
import StudentSelector from "./StudentSelector";
import QuranViewer from "./QuranViewer";
import PerformanceEvaluation from "./PerformanceEvaluation";
import RecitationNotes from "./RecitationNotes";
import RecitationToolbar from "./RecitationToolbar";

interface Student {
  id: string;
  name: string;
  group: string;
  level: string;
  lastSession?: string;
  progress?: number;
  avatarUrl?: string;
}

interface EvaluationData {
  recitationRating: number;
  memorizationRating: number;
  tajweedRating: number;
  notes: string;
}

interface QuranTrackingPageProps {
  students?: Student[];
  initialPage?: number;
  bookmarks?: number[];
  onSaveEvaluation?: (
    studentId: string,
    evaluation: EvaluationData,
    pageNumber: number,
    ayahRange: string,
  ) => void;
  onNavigateBack?: () => void;
}

const QuranTrackingPage = ({
  students = [],
  initialPage = 1,
  bookmarks = [1, 5, 10],
  onSaveEvaluation = () => {},
  onNavigateBack = () => {},
}: QuranTrackingPageProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [selectedAyahRange, setSelectedAyahRange] = useState<{
    start: number;
    end: number;
    pageNumber: number;
  } | null>(null);
  const [highlightedAyahs, setHighlightedAyahs] = useState<
    {
      start: number;
      end: number;
      pageNumber: number;
      color: string;
    }[]
  >([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Handle student selection
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  // Handle page change in Quran viewer
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle ayah selection in Quran viewer
  const handleSelectionChange = (selection: {
    start: number;
    end: number;
    pageNumber: number;
  }) => {
    setSelectedAyahRange(selection);

    // Add highlight for the selected ayahs
    setHighlightedAyahs([
      ...highlightedAyahs.filter(
        (h) =>
          h.pageNumber !== selection.pageNumber ||
          (h.start !== selection.start && h.end !== selection.end),
      ),
      { ...selection, color: "#f59e0b" },
    ]);
  };

  // Toggle recording mode
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // Handle marking an error during recitation
  const handleMarkError = (errorType: string, ayahNumber: number) => {
    // Create a new note based on the error type
    const errorMessages = {
      pronunciation: "خطأ في نطق الحروف",
      tajweed: "عدم تطبيق أحكام التجويد",
      memorization: "خطأ في الحفظ",
      repetition: "تكرار غير مطلوب",
    };

    const errorTypeMap: { [key: string]: string } = errorMessages;
    const errorMessage = errorTypeMap[errorType] || "خطأ غير محدد";

    // In a real implementation, this would add a note to the database
    console.log(
      `Adding error note: ${errorMessage} at ayah ${ayahNumber}, page ${currentPage}`,
    );

    // Highlight the ayah with an error
    const errorColors: { [key: string]: string } = {
      pronunciation: "#ef4444",
      tajweed: "#8b5cf6",
      memorization: "#f59e0b",
      repetition: "#3b82f6",
    };

    // Add a new highlight for the error
    setHighlightedAyahs([
      ...highlightedAyahs,
      {
        start: ayahNumber,
        end: ayahNumber,
        pageNumber: currentPage,
        color: errorColors[errorType] || "#ef4444",
      },
    ]);
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (pageNumber: number) => {
    console.log(`Toggling bookmark for page ${pageNumber}`);
    // In a real implementation, this would update the bookmarks array
  };

  // Handle saving evaluation
  const handleSaveEvaluation = (evaluation: EvaluationData) => {
    if (selectedStudent && selectedAyahRange) {
      const ayahRange = `${selectedAyahRange.start}-${selectedAyahRange.end}`;
      onSaveEvaluation(selectedStudent.id, evaluation, currentPage, ayahRange);

      // Show success message or update UI as needed
      alert("تم حفظ التقييم بنجاح");
    } else {
      alert("الرجاء اختيار طالب وتحديد نطاق الآيات");
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-[#f8f7f2] islamic-pattern p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-1">
            <h1 className="text-3xl font-bold text-gray-800 font-amiri">
              متابعة التلاوة والحفظ
            </h1>
            <p className="text-gray-600">تقييم أداء الطلاب في التلاوة والحفظ</p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onNavigateBack}
          >
            <ArrowLeft className="h-4 w-4" />
            العودة
          </Button>
        </div>

        {/* Student Selector */}
        <StudentSelector
          students={students}
          onSelectStudent={handleSelectStudent}
          selectedStudent={selectedStudent}
        />

        {/* Main Content */}
        {selectedStudent ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quran Viewer */}
            <div className="lg:col-span-8">
              <Card className="bg-white shadow-md border-2 border-emerald-100">
                <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-3">
                  <CardTitle className="text-xl font-bold text-emerald-800 flex items-center">
                    <BookOpen className="ml-2 h-5 w-5" />
                    المصحف الشريف - متابعة الطالب: {selectedStudent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-[600px]">
                    <QuranViewer
                      initialPage={currentPage}
                      onPageChange={handlePageChange}
                      onSelectionChange={handleSelectionChange}
                      highlightedAyahs={highlightedAyahs}
                      bookmarks={bookmarks}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel with Tabs */}
            <div className="lg:col-span-4 space-y-4">
              {/* Performance Evaluation */}
              <div className="h-[300px]">
                <PerformanceEvaluation
                  studentName={selectedStudent.name}
                  surahName={`سورة ${currentPage}`} // Simplified for demo
                  ayahRange={
                    selectedAyahRange
                      ? `${selectedAyahRange.start}-${selectedAyahRange.end}`
                      : ""
                  }
                  onSave={handleSaveEvaluation}
                />
              </div>

              {/* Recitation Notes */}
              <div className="h-[300px]">
                <RecitationNotes
                  studentId={selectedStudent.id}
                  studentName={selectedStudent.name}
                  pageNumber={currentPage}
                  onAddNote={(note) => {
                    console.log("Adding note:", note);
                    // In a real implementation, this would add the note to the database
                  }}
                  onEditNote={(noteId, text, type) => {
                    console.log("Editing note:", noteId, text, type);
                    // In a real implementation, this would update the note in the database
                  }}
                  onDeleteNote={(noteId) => {
                    console.log("Deleting note:", noteId);
                    // In a real implementation, this would delete the note from the database
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <Card className="bg-white p-8 text-center shadow-md border-2 border-sky-100">
            <div className="flex flex-col items-center justify-center space-y-4">
              <BookOpen className="h-16 w-16 text-sky-300" />
              <h3 className="text-xl font-bold text-gray-700 font-amiri">
                الرجاء اختيار طالب للبدء
              </h3>
              <p className="text-gray-500 max-w-md">
                قم باختيار طالب من القائمة أعلاه لبدء متابعة التلاوة والحفظ
                وتقييم الأداء
              </p>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 font-amiri">
              تعليمات المتابعة والتقييم
            </h3>
            <Separator className="my-2" />
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>اختر الطالب من القائمة أعلاه</li>
              <li>انتقل إلى الصفحة المطلوبة في المصحف</li>
              <li>حدد نطاق الآيات المراد تقييمها</li>
              <li>
                استمع إلى تلاوة الطالب وقيّم أداءه في التلاوة والحفظ والتجويد
              </li>
              <li>أضف ملاحظات إضافية إن وجدت</li>
              <li>احفظ التقييم</li>
            </ol>
          </CardContent>
        </Card>

        {/* Islamic Pattern Decoration */}
        <div className="mt-8 opacity-10">
          <div className="h-24 w-full bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1000')] bg-repeat-x bg-contain" />
        </div>

        {/* Recitation Toolbar */}
        <RecitationToolbar
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          onMarkError={handleMarkError}
          selectedAyah={selectedAyahRange?.start || null}
        />
      </div>
    </div>
  );
};

export default QuranTrackingPage;
