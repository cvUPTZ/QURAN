import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Moon,
  Sun,
  Settings,
  Printer,
  Share2,
  Mic,
  PauseCircle,
  Pen,
  Info,
  X,
  Check,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { quranFoundationAPI } from "@/services/quranFoundationAPI";
import QuranPageNavigator from "./QuranPageNavigator";
import QuranAudioPlayer from "./QuranAudioPlayer";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  pageNumber: number;
  ayahNumber: number;
  color: string;
  text: string;
  timestamp: number;
  type: "note" | "error" | "tajweed" | "memorization";
}

interface EnhancedQuranViewerProps {
  initialPage?: number;
  onPageChange?: (pageNumber: number) => void;
  onSelectionChange?: (selection: {
    start: number;
    end: number;
    pageNumber: number;
  }) => void;
  highlightedAyahs?: {
    start: number;
    end: number;
    pageNumber: number;
    color: string;
    note?: string;
  }[];
  bookmarks?: number[];
  onBookmarkToggle?: (pageNumber: number) => void;
  onAddNote?: (note: Note) => void;
  onDeleteNote?: (noteId: string) => void;
  onUpdateNote?: (note: Note) => void;
  notes?: Note[];
  isRecordingMode?: boolean;
  onToggleRecordingMode?: () => void;
}

const EnhancedQuranViewer: React.FC<EnhancedQuranViewerProps> = ({
  initialPage = 1,
  onPageChange = () => {},
  onSelectionChange = () => {},
  highlightedAyahs = [],
  bookmarks = [],
  onBookmarkToggle = () => {},
  onAddNote = () => {},
  onDeleteNote = () => {},
  onUpdateNote = () => {},
  notes = [],
  isRecordingMode = false,
  onToggleRecordingMode = () => {},
}) => {
  // State
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(
    "quran-dark-mode",
    false,
  );
  const [showTranslation, setShowTranslation] = useLocalStorage<boolean>(
    "quran-show-translation",
    false,
  );
  const [currentTranslation, setCurrentTranslation] = useLocalStorage<number>(
    "quran-translation",
    131, // Default to Sahih International
  );
  const [selectedAyah, setSelectedAyah] = useState<string | null>(null);
  const [errorReportType, setErrorReportType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);
  const [currentReciter, setCurrentReciter] = useLocalStorage<number>(
    "quran-reciter",
    7, // Default to Mishary Rashid Alafasy
  );
  const [pageData, setPageData] = useState<any>(null);
  const [wordPositions, setWordPositions] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [translations, setTranslations] = useState<{ [key: string]: string[] }>(
    {},
  );
  const [audioUrls, setAudioUrls] = useState<string[]>([]);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Load page data when current page changes
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (showTranslation) {
          data = await quranFoundationAPI.getPageWithTranslation(
            currentPage,
            currentTranslation,
          );

          // Extract translations
          const pageTranslations: { [language: string]: string[] } = {};
          if (data.verses && data.verses.length > 0) {
            const translationKey = Object.keys(
              data.verses[0].translations || {},
            )[0];
            if (translationKey) {
              pageTranslations[translationKey] = data.verses.map(
                (verse: any) => verse.translations?.[translationKey] || "",
              );
            }
          }
          setTranslations(pageTranslations);
        } else {
          data = await quranFoundationAPI.getPage(currentPage);
        }
        setPageData(data);

        // Fetch word positions
        const positions =
          await quranFoundationAPI.getWordPositions(currentPage);
        setWordPositions(positions);

        // Fetch audio URLs
        const urls = await quranFoundationAPI.getPageAudio(
          currentPage,
          currentReciter,
        );
        setAudioUrls(urls);
      } catch (err) {
        console.error("Error loading Quran page:", err);
        setError("Failed to load Quran page. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
    onPageChange(currentPage);
  }, [
    currentPage,
    showTranslation,
    currentTranslation,
    currentReciter,
    onPageChange,
  ]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
          handlePageChange(currentPage - 1);
          break;
        case "ArrowLeft":
          handlePageChange(currentPage + 1);
          break;
        case "Home":
          handlePageChange(1);
          break;
        case "End":
          handlePageChange(604);
          break;
        case "b":
          onBookmarkToggle(currentPage);
          break;
        case "f":
          toggleFullScreen();
          break;
        case "+":
          setZoomLevel(Math.min(150, zoomLevel + 10));
          break;
        case "-":
          setZoomLevel(Math.max(50, zoomLevel - 10));
          break;
        case "/":
          searchInputRef.current?.focus();
          e.preventDefault();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, zoomLevel, onBookmarkToggle]);

  // Page change handler
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= 604) {
      setCurrentPage(newPage);
    }
  }, []);

  // Toggle fullscreen mode
  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  // Handle ayah selection
  const handleAyahClick = useCallback(
    (ayahKey: string, ayahNumber: number) => {
      const isAlreadySelected = selectedAyah === ayahKey;

      // If we're in recording mode and have an error type selected, add a note
      if (isRecordingMode && errorReportType && !isAlreadySelected) {
        const newNote: Note = {
          id: `note-${Date.now()}`,
          pageNumber: currentPage,
          ayahNumber,
          color: getColorForErrorType(errorReportType),
          text: `${errorReportType} في الآية ${ayahNumber}`,
          timestamp: Date.now(),
          type: getTypeForErrorType(errorReportType),
        };

        onAddNote(newNote);
      }

      setSelectedAyah(isAlreadySelected ? null : ayahKey);

      if (!isAlreadySelected) {
        onSelectionChange({
          start: ayahNumber,
          end: ayahNumber,
          pageNumber: currentPage,
        });
      }
    },
    [
      currentPage,
      errorReportType,
      isRecordingMode,
      onAddNote,
      onSelectionChange,
      selectedAyah,
    ],
  );

  // Helper function to get color for error type
  const getColorForErrorType = (type: string): string => {
    switch (type) {
      case "خطأ نطق":
        return "#f87171";
      case "خطأ تجويد":
        return "#a78bfa";
      case "خطأ حفظ":
        return "#fbbf24";
      default:
        return "#10b981";
    }
  };

  // Helper function to get note type from error type
  const getTypeForErrorType = (type: string): Note["type"] => {
    switch (type) {
      case "خطأ نطق":
        return "error";
      case "خطأ تجويد":
        return "tajweed";
      case "خطأ حفظ":
        return "memorization";
      default:
        return "note";
    }
  };

  // Perform search
  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await quranFoundationAPI.search(searchQuery);
      setSearchResults(results?.verses || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Print current page
  const printCurrentPage = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (printWindow && pageData) {
      printWindow.document.write(`
        <html>
          <head>
            <title>مصحف - صفحة ${currentPage}</title>
            <style>
              body { 
                display: flex; 
                flex-direction: column;
                align-items: center;
                font-family: 'Traditional Arabic', 'Scheherazade', serif;
                direction: rtl;
                padding: 20px;
              }
              .page-header {
                margin-bottom: 20px;
                text-align: center;
              }
              .quran-text {
                font-size: 24px;
                line-height: 2;
                text-align: center;
                max-width: 800px;
                margin: 0 auto;
              }
              .verse {
                margin-bottom: 10px;
              }
              .verse-number {
                font-size: 14px;
                color: #666;
                margin-right: 5px;
              }
            </style>
          </head>
          <body>
            <div class="page-header">
              <h1>صفحة ${currentPage} من المصحف الشريف</h1>
            </div>
            <div class="quran-text">
              ${pageData.verses
                .map(
                  (verse: any) => `
                <div class="verse">
                  <span class="verse-text">${verse.text_uthmani}</span>
                  <span class="verse-number">(${verse.verse_key})</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }, [currentPage, pageData]);

  // Share current page
  const shareCurrentPage = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: `مصحف - صفحة ${currentPage}`,
          text: `أقرأ صفحة ${currentPage} من المصحف الشريف`,
          url: `${window.location.origin}?page=${currentPage}`,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard
        .writeText(`${window.location.origin}?page=${currentPage}`)
        .then(() => alert("تم نسخ الرابط"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  }, [currentPage]);

  // Render recording controls
  const renderRecordingControls = useCallback(() => {
    if (!isRecordingMode) return null;

    const errorTypes = [
      {
        label: "خطأ نطق",
        color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
      },
      {
        label: "خطأ تجويد",
        color:
          "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
      },
      {
        label: "خطأ حفظ",
        color:
          "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
      },
      {
        label: "ملاحظة",
        color:
          "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
      },
    ];

    return (
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white border-red-600 flex items-center gap-1"
          onClick={onToggleRecordingMode}
        >
          <PauseCircle className="h-4 w-4" />
          <span>إيقاف التسجيل</span>
        </Button>

        <div className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-md border border-gray-200 dark:border-gray-700 shadow-md">
          <p className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
            تسجيل ملاحظة:
          </p>
          <div className="flex flex-col gap-1">
            {errorTypes.map((type, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`${errorReportType === type.label ? "ring-2 ring-offset-1 ring-blue-500" : ""} ${type.color} text-xs justify-start`}
                onClick={() => {
                  setErrorReportType((prevType) =>
                    prevType === type.label ? null : type.label,
                  );
                }}
              >
                {type.label}
                {errorReportType === type.label && (
                  <Check className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>

          {errorReportType && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              انقر على آية لتسجيل ملاحظة من نوع "{errorReportType}"
            </div>
          )}
        </div>
      </div>
    );
  }, [errorReportType, isRecordingMode, onToggleRecordingMode]);

  // Create a grid of ayahs for the current page
  const renderAyahGrid = useCallback(() => {
    if (!pageData || !pageData.verses) return null;

    return pageData.verses.map((verse: any) => {
      const ayahKey = verse.verse_key;
      const ayahNumber = parseInt(ayahKey.split(":")[1]);

      // In a real implementation, you would use actual ayah positions
      // This is a simplified approach that divides the page evenly
      const index = pageData.verses.indexOf(verse);
      const topPercentage = (index * 100) / pageData.verses.length;
      const heightPercentage = 100 / pageData.verses.length;

      return (
        <div
          key={`ayah-${ayahKey}`}
          className={cn(
            "absolute border border-transparent hover:border-emerald-300 dark:hover:border-emerald-500",
            "hover:bg-emerald-50/30 dark:hover:bg-emerald-800/20 rounded-md cursor-pointer transition-colors",
            selectedAyah === ayahKey
              ? "bg-emerald-100/50 dark:bg-emerald-800/30 border-emerald-400 dark:border-emerald-600"
              : "",
          )}
          style={{
            top: `${topPercentage}%`,
            right: "5%",
            left: "5%",
            height: `${heightPercentage}%`,
            zIndex: 10,
          }}
          onClick={() => handleAyahClick(ayahKey, ayahNumber)}
          title={`آية ${ayahNumber}`}
        />
      );
    });
  }, [handleAyahClick, pageData, selectedAyah]);

  // Notes for current page
  const pageNotes = notes.filter((note) => note.pageNumber === currentPage);

  // Render highlighted ayahs and notes
  const renderHighlightsAndNotes = useCallback(() => {
    if (!pageData || !pageData.verses) return null;

    const allHighlights = [
      ...highlightedAyahs.filter((h) => h.pageNumber === currentPage),
      ...pageNotes.map((note) => ({
        start: note.ayahNumber,
        end: note.ayahNumber,
        pageNumber: note.pageNumber,
        color: note.color,
        note: note.text,
      })),
    ];

    return allHighlights.map((highlight, index) => {
      // Find the ayah index in the current page data
      const startAyahIndex = pageData.verses.findIndex(
        (verse: any) =>
          parseInt(verse.verse_key.split(":")[1]) === highlight.start,
      );
      const endAyahIndex = pageData.verses.findIndex(
        (verse: any) =>
          parseInt(verse.verse_key.split(":")[1]) === highlight.end,
      );

      if (startAyahIndex === -1) return null;

      // Calculate position based on ayah indices
      const topPercentage = (startAyahIndex * 100) / pageData.verses.length;
      const heightPercentage =
        ((endAyahIndex - startAyahIndex + 1) * 100) / pageData.verses.length;

      return (
        <div
          key={index}
          className="absolute quran-ayah-highlight group"
          style={{
            top: `${topPercentage}%`,
            right: "5%",
            left: "5%",
            height: `${heightPercentage}%`,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: highlight.color,
            backgroundColor: `${highlight.color}20`,
            zIndex: 5,
          }}
        >
          {highlight.note && (
            <div className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="h-4 w-4 rounded-full bg-white dark:bg-gray-800 border-2"
                      style={{ borderColor: highlight.color }}
                    ></div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-sm">{highlight.note}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      );
    });
  }, [currentPage, highlightedAyahs, pageData, pageNotes]);

  // Render translation overlay
  const renderTranslation = useCallback(() => {
    if (
      !showTranslation ||
      !translations ||
      Object.keys(translations).length === 0
    )
      return null;

    const translationKey = Object.keys(translations)[0];
    const translationText = translations[translationKey] || [];

    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 p-4 border-t border-gray-200 dark:border-gray-700 max-h-1/3 overflow-y-auto text-sm">
        <ScrollArea className="h-32">
          {translationText.map((text, index) => (
            <div key={index} className="mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                آية {pageData?.verses[index]?.verse_key || index + 1}:
              </p>
              <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                {text}
              </p>
              <Separator className="my-2" />
            </div>
          ))}
        </ScrollArea>
      </div>
    );
  }, [pageData?.verses, showTranslation, translations]);

  // Render page metadata
  const renderPageMetadata = useCallback(() => {
    if (!pageData) return null;

    // Extract metadata from page data
    const surahNames = [
      ...new Set(pageData.verses?.map((verse: any) => verse.surah.name) || []),
    ];
    const juzNumber = pageData.meta?.juz || Math.ceil(currentPage / 20); // Fallback calculation

    return (
      <div className="absolute top-2 right-2 z-20 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-md py-1 px-2 text-xs shadow-sm">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {surahNames.map((name, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            >
              {name}
            </Badge>
          ))}
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            الجزء {juzNumber}
          </Badge>
        </div>
      </div>
    );
  }, [currentPage, pageData]);

  // Render Quran text
  const renderQuranText = useCallback(() => {
    if (!pageData || !pageData.verses) return null;

    return (
      <div className="quran-text-container p-4 text-center">
        {pageData.verses.map((verse: any, index: number) => (
          <div
            key={verse.verse_key}
            className={cn(
              "mb-4 text-2xl leading-loose font-quran",
              selectedAyah === verse.verse_key
                ? "bg-emerald-100/50 dark:bg-emerald-800/30 rounded-md p-2"
                : "",
            )}
            onClick={() =>
              handleAyahClick(
                verse.verse_key,
                parseInt(verse.verse_key.split(":")[1]),
              )
            }
          >
            <span className="verse-text">{verse.text_uthmani}</span>
            <span className="verse-number inline-block mx-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 text-gray-600 dark:text-gray-400">
              {verse.verse_key.split(":")[1]}
            </span>
          </div>
        ))}
      </div>
    );
  }, [handleAyahClick, pageData, selectedAyah]);

  // Main render
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full flex flex-col",
        "bg-slate-100 dark:bg-gray-900 transition-colors",
        darkMode ? "dark" : "",
      )}
    >
      {/* Page Navigator */}
      <QuranPageNavigator
        currentPage={currentPage}
        onPageChange={handlePageChange}
        bookmarks={bookmarks}
        onBookmarkToggle={onBookmarkToggle}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <div className="relative">
            <Input
              ref={searchInputRef}
              placeholder="بحث في القرآن"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performSearch()}
              className="h-8 w-40 md:w-60 pl-8 rtl:pl-2 rtl:pr-8 text-sm"
            />
            <Search
              className="h-4 w-4 absolute left-2 rtl:left-auto rtl:right-2 top-2 text-gray-400 cursor-pointer"
              onClick={performSearch}
            />

            {searchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-72 bg-white dark:bg-gray-900 rounded-md shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700 text-xs font-medium">
                  تم العثور على {searchResults.length} نتيجة
                </div>
                <ScrollArea className="h-60">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-2 border-b last:border-b-0 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        handlePageChange(result.page_number);
                        setSearchResults([]);
                      }}
                    >
                      <p className="text-xs font-medium">
                        صفحة {result.page_number} - آية {result.verse_key}
                      </p>
                      <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                        {result.text_uthmani}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                  aria-label="تشغيل التلاوة"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>تشغيل التلاوة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleRecordingMode}
                  className={isRecordingMode ? "text-red-500" : ""}
                  aria-label={isRecordingMode ? "إيقاف التسجيل" : "بدء التسجيل"}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRecordingMode ? "إيقاف التسجيل" : "بدء التسجيل"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={printCurrentPage}
                  aria-label="طباعة الصفحة"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>طباعة الصفحة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={shareCurrentPage}
                  aria-label="مشاركة"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>مشاركة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="الإعدادات">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">الإعدادات</h4>

                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-dark-mode" className="text-sm">
                    الوضع الليلي
                  </Label>
                  <Switch
                    id="toggle-dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="toggle-translation" className="text-sm">
                    إظهار الترجمة
                  </Label>
                  <Switch
                    id="toggle-translation"
                    checked={showTranslation}
                    onCheckedChange={setShowTranslation}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">حجم الصفحة</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                      disabled={zoomLevel <= 50}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center text-sm">
                      {zoomLevel}%
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setZoomLevel(Math.min(150, zoomLevel + 10))
                      }
                      disabled={zoomLevel >= 150}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={toggleFullScreen}
                  >
                    {isFullScreen ? (
                      <>
                        <Minimize2 className="h-3 w-3 mr-1" /> إنهاء ملء الشاشة
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-3 w-3 mr-1" /> ملء الشاشة
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  aria-label={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {darkMode ? "الوضع النهاري" : "الوضع الليلي"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Audio Player */}
      {showAudioPlayer && audioUrls.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-800">
          <QuranAudioPlayer
            audioUrls={audioUrls}
            currentReciter={currentReciter}
            onReciterChange={setCurrentReciter}
          />
        </div>
      )}

      {/* Content */}
      <Card className="flex-1 overflow-hidden border-0 shadow-none bg-transparent">
        <CardContent className="flex items-center justify-center p-0 h-full relative">
          {/* Loading indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
              <div className="h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
          )}

          {/* Page metadata display */}
          {renderPageMetadata()}

          {/* Recording controls */}
          {renderRecordingControls()}

          {/* Main Quran content */}
          <div
            className="relative rounded-md overflow-hidden w-full h-full"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transition: "transform 0.2s",
            }}
          >
            {/* Interactive ayah grid */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
              {renderAyahGrid()}
            </div>

            {/* Highlights and notes */}
            <div className="absolute inset-0">{renderHighlightsAndNotes()}</div>

            {/* Quran text content */}
            <div className="max-h-full overflow-auto bg-[#f8f7f2] dark:bg-gray-800 p-4 quran-page">
              {renderQuranText()}
            </div>

            {/* Fallback content if data fails to load */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-center p-4">
                <div>
                  <Info className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    تعذر تحميل الصفحة
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setLoading(true);
                      setError(null);
                      quranFoundationAPI
                        .getPage(currentPage)
                        .then((data) => {
                          setPageData(data);
                          setLoading(false);
                        })
                        .catch((err) => {
                          console.error(err);
                          setError("Failed to load page");
                          setLoading(false);
                        });
                    }}
                  >
                    إعادة المحاولة
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Translation overlay */}
          {renderTranslation()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedQuranViewer;
