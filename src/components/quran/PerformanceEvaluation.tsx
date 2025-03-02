import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Save, BookOpen, Mic, AlertCircle } from "lucide-react";

interface PerformanceEvaluationProps {
  studentName?: string;
  surahName?: string;
  ayahRange?: string;
  onSave?: (evaluation: EvaluationData) => void;
}

interface EvaluationData {
  recitationRating: number;
  memorizationRating: number;
  tajweedRating: number;
  notes: string;
}

const PerformanceEvaluation = ({
  studentName = "أحمد محمد",
  surahName = "البقرة",
  ayahRange = "١-٥",
  onSave = () => {},
}: PerformanceEvaluationProps) => {
  const [recitationRating, setRecitationRating] = useState<number>(0);
  const [memorizationRating, setMemorizationRating] = useState<number>(0);
  const [tajweedRating, setTajweedRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("recitation");

  const handleSave = () => {
    const evaluationData: EvaluationData = {
      recitationRating,
      memorizationRating,
      tajweedRating,
      notes,
    };
    onSave(evaluationData);
  };

  const renderStarRating = (
    rating: number,
    setRating: React.Dispatch<React.SetStateAction<number>>,
    maxStars: number = 5,
  ) => {
    return (
      <div className="flex items-center justify-center gap-1 my-3 dir-rtl">
        {[...Array(maxStars)].map((_, index) => (
          <button
            key={index}
            type="button"
            className="focus:outline-none"
            onClick={() => setRating(index + 1)}
          >
            <Star
              className={`h-8 w-8 ${index < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full h-full bg-white border-2 border-amber-100 shadow-md overflow-auto">
      <CardHeader className="bg-amber-50 border-b border-amber-100 pb-4">
        <CardTitle className="text-xl font-bold text-amber-800 text-right">
          تقييم أداء الطالب
        </CardTitle>
        <div className="text-right text-amber-700">
          <p className="text-sm">
            الطالب: <span className="font-semibold">{studentName}</span>
          </p>
          <p className="text-sm">
            السورة: <span className="font-semibold">{surahName}</span> | الآيات:{" "}
            <span className="font-semibold">{ayahRange}</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs
          defaultValue="recitation"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="recitation" className="flex items-center gap-1">
              <Mic className="h-4 w-4" />
              <span>التلاوة</span>
            </TabsTrigger>
            <TabsTrigger
              value="memorization"
              className="flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>الحفظ</span>
            </TabsTrigger>
            <TabsTrigger value="tajweed" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>التجويد</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recitation" className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                تقييم التلاوة
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                قيّم مستوى التلاوة من ١ إلى ٥ نجوم
              </p>
              {renderStarRating(recitationRating, setRecitationRating)}
            </div>
          </TabsContent>

          <TabsContent value="memorization" className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                تقييم الحفظ
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                قيّم مستوى الحفظ من ١ إلى ٥ نجوم
              </p>
              {renderStarRating(memorizationRating, setMemorizationRating)}
            </div>
          </TabsContent>

          <TabsContent value="tajweed" className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                تقييم التجويد
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                قيّم مستوى التجويد من ١ إلى ٥ نجوم
              </p>
              {renderStarRating(tajweedRating, setTajweedRating)}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Label htmlFor="notes" className="text-right block mb-2">
            ملاحظات إضافية
          </Label>
          <Textarea
            id="notes"
            placeholder="أضف ملاحظات حول أداء الطالب هنا..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] text-right"
          />
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSave}
            className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>حفظ التقييم</span>
          </Button>
        </div>

        <div className="mt-6 p-3 bg-amber-50 rounded-md border border-amber-100">
          <h4 className="text-sm font-semibold text-amber-800 mb-2 text-right">
            ملخص التقييم
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-600">التلاوة</p>
              <div className="flex justify-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < recitationRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600">الحفظ</p>
              <div className="flex justify-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < memorizationRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600">التجويد</p>
              <div className="flex justify-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${index < tajweedRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceEvaluation;
