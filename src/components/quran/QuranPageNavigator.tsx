import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface QuranPageNavigatorProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  bookmarks?: number[];
  onBookmarkToggle?: (page: number) => void;
  surahs?: { number: number; name: string; page: number }[];
  juzs?: { number: number; name: string; page: number }[];
}

const QuranPageNavigator: React.FC<QuranPageNavigatorProps> = ({
  currentPage,
  totalPages = 604,
  onPageChange,
  bookmarks = [],
  onBookmarkToggle = () => {},
  surahs = [],
  juzs = [],
}) => {
  const [showGotoDialog, setShowGotoDialog] = useState(false);
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [selectedSurah, setSelectedSurah] = useState<string>("");
  const [selectedJuz, setSelectedJuz] = useState<string>("");
  const [lastVisitedPages, setLastVisitedPages] = useLocalStorage<number[]>(
    "quran-last-visited",
    [1],
  );

  // Default surahs if none provided
  const defaultSurahs = [
    { number: 1, name: "الفاتحة", page: 1 },
    { number: 2, name: "البقرة", page: 2 },
    { number: 3, name: "آل عمران", page: 50 },
    { number: 4, name: "النساء", page: 77 },
    { number: 5, name: "المائدة", page: 106 },
    // Add more as needed
  ];

  // Default juzs if none provided
  const defaultJuzs = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    name: `الجزء ${i + 1}`,
    page: i * 20 + 1, // Approximate page number
  }));

  const displaySurahs = surahs.length > 0 ? surahs : defaultSurahs;
  const displayJuzs = juzs.length > 0 ? juzs : defaultJuzs;

  // Update last visited pages when current page changes
  useEffect(() => {
    const updatedPages = [
      currentPage,
      ...lastVisitedPages.filter((p) => p !== currentPage),
    ].slice(0, 5);
    setLastVisitedPages(updatedPages);
  }, [currentPage, lastVisitedPages, setLastVisitedPages]);

  // Handle page input change
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  // Go to specific page
  const goToPage = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setShowGotoDialog(false);
    }
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Go to surah
  const goToSurah = (surahNumber: string) => {
    const surah = displaySurahs.find(
      (s) => s.number.toString() === surahNumber,
    );
    if (surah) {
      onPageChange(surah.page);
      setSelectedSurah("");
      setShowGotoDialog(false);
    }
  };

  // Go to juz
  const goToJuz = (juzNumber: string) => {
    const juz = displayJuzs.find((j) => j.number.toString() === juzNumber);
    if (juz) {
      onPageChange(juz.page);
      setSelectedJuz("");
      setShowGotoDialog(false);
    }
  };

  // Toggle bookmark for current page
  const toggleBookmark = () => {
    onBookmarkToggle(currentPage);
  };

  // Check if current page is bookmarked
  const isBookmarked = bookmarks.includes(currentPage);

  return (
    <div className="flex items-center justify-between w-full bg-white dark:bg-gray-900 p-2 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1">
          <span className="text-sm font-medium">
            صفحة {currentPage} من {totalPages}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleBookmark}
          className={isBookmarked ? "text-amber-500" : ""}
          aria-label={
            isBookmarked ? "إزالة الإشارة المرجعية" : "إضافة إشارة مرجعية"
          }
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        <Dialog open={showGotoDialog} onOpenChange={setShowGotoDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              انتقال إلى
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>الانتقال إلى</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="page">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="page">الصفحة</TabsTrigger>
                <TabsTrigger value="surah">السورة</TabsTrigger>
                <TabsTrigger value="juz">الجزء</TabsTrigger>
              </TabsList>

              <TabsContent value="page" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-number">رقم الصفحة</Label>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Input
                        id="page-number"
                        type="number"
                        min={1}
                        max={totalPages}
                        value={pageInput}
                        onChange={handlePageInputChange}
                        onKeyDown={(e) => e.key === "Enter" && goToPage()}
                        className="text-center"
                      />
                      <Button onClick={goToPage}>انتقال</Button>
                    </div>
                  </div>

                  {lastVisitedPages.length > 0 && (
                    <div className="space-y-2">
                      <Label>آخر الصفحات المزارة</Label>
                      <div className="flex flex-wrap gap-2">
                        {lastVisitedPages.map((page) => (
                          <Button
                            key={page}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onPageChange(page);
                              setShowGotoDialog(false);
                            }}
                          >
                            صفحة {page}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {bookmarks.length > 0 && (
                    <div className="space-y-2">
                      <Label>الإشارات المرجعية</Label>
                      <ScrollArea className="h-40">
                        <div className="flex flex-wrap gap-2">
                          {bookmarks.map((page) => (
                            <Button
                              key={page}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => {
                                onPageChange(page);
                                setShowGotoDialog(false);
                              }}
                            >
                              <Bookmark className="h-3 w-3 text-amber-500" />
                              صفحة {page}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="surah" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="surah-select">اختر السورة</Label>
                    <Select value={selectedSurah} onValueChange={goToSurah}>
                      <SelectTrigger id="surah-select">
                        <SelectValue placeholder="اختر السورة" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-60">
                          {displaySurahs.map((surah) => (
                            <SelectItem
                              key={surah.number}
                              value={surah.number.toString()}
                            >
                              {surah.number}. {surah.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {displaySurahs.slice(0, 6).map((surah) => (
                      <Button
                        key={surah.number}
                        variant="outline"
                        size="sm"
                        className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                        onClick={() => {
                          onPageChange(surah.page);
                          setShowGotoDialog(false);
                        }}
                      >
                        {surah.number}. {surah.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="juz" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="juz-select">اختر الجزء</Label>
                    <Select value={selectedJuz} onValueChange={goToJuz}>
                      <SelectTrigger id="juz-select">
                        <SelectValue placeholder="اختر الجزء" />
                      </SelectTrigger>
                      <SelectContent>
                        {displayJuzs.map((juz) => (
                          <SelectItem
                            key={juz.number}
                            value={juz.number.toString()}
                          >
                            {juz.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {displayJuzs.map((juz) => (
                      <Button
                        key={juz.number}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onPageChange(juz.page);
                          setShowGotoDialog(false);
                        }}
                      >
                        {juz.number}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuranPageNavigator;
