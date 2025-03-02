import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  Bookmark,
  Volume2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Mic,
  PauseCircle,
  Settings,
  Download,
  Share2,
  Printer,
  Moon,
  Sun,
  PlayCircle,
  SkipForward,
  SkipBack,
  Info,
  X,
  Check,
  Pen,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

// Type definitions
interface QuranPage {
  pageNumber: number;
  imageUrl: string;
  surahName: string;
  juzNumber: number;
  hizbNumber: number;
  surahs: Array<{
    number: number;
    name: string;
    startAyah: number;
    endAyah?: number;
  }>;
}

interface QuranViewerProps {
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
  translations?: { [key: string]: string };
}

interface Note {
  id: string;
  pageNumber: number;
  ayahNumber: number;
  color: string;
  text: string;
  timestamp: number;
  type: 'note' | 'error' | 'tajweed' | 'memorization';
}

// Custom hook for audio playback
const useQuranAudio = (currentPage: number) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentReciter, setCurrentReciter] = useState("mishary_rashid_alafasy");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const reciters = [
    { id: "mishary_rashid_alafasy", name: "مشاري راشد العفاسي" },
    { id: "abdul_basit_murattal", name: "عبد الباسط عبد الصمد" },
    { id: "mahmoud_khalil_al-husary", name: "محمود خليل الحصري" },
    { id: "abu_bakr_al-shatri", name: "أبو بكر الشاطري" },
    { id: "ahmed_al_ajmi", name: "أحمد العجمي" },
  ];
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioProgress(0);
    }
    
    // In real implementation, you'd load the correct audio file for the page
    audioRef.current = new Audio(`/audio/${currentReciter}/page${currentPage}.mp3`);
    
    const updateProgress = () => {
      if (audioRef.current) {
        setAudioProgress(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
      audioRef.current.addEventListener("ended", handleEnded);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.pause();
      }
    };
  }, [currentPage, currentReciter]);
  
  const togglePlayback = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);
  
  const changeReciter = useCallback((reciterId: string) => {
    setCurrentReciter(reciterId);
  }, []);
  
  return {
    isPlaying,
    audioProgress,
    togglePlayback,
    currentReciter,
    changeReciter,
    reciters
  };
};

// Enhanced QuranViewer component
const QuranViewer = ({
  initialPage = 1,
  onPageChange = () => {},
  onSelectionChange = () => {},
  highlightedAyahs = [],
  bookmarks = [],
  onBookmarkToggle = () => {},
  translations = {},
}: QuranViewerProps) => {
  // State management
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{ pageNumber: number; ayahNumber: number; text: string }[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("quran-dark-mode", false);
  const [showTranslation, setShowTranslation] = useLocalStorage<boolean>("quran-show-translation", false);
  const [currentTranslation, setCurrentTranslation] = useLocalStorage<string>("quran-translation", "english");
  const [notes, setNotes] = useLocalStorage<Note[]>("quran-notes", []);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [errorReportType, setErrorReportType] = useState<string | null>(null);
  const [lastVisitedPages, setLastVisitedPages] = useLocalStorage<number[]>("quran-last-visited", [1]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [showGotoDialog, setShowGotoDialog] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    isPlaying,
    audioProgress,
    togglePlayback,
    currentReciter,
    changeReciter,
    reciters
  } = useQuranAudio(currentPage);

  // Enhanced data structure for Quran pages with more metadata
  const quranPages: QuranPage[] = Array.from({ length: 604 }, (_, i) => ({
    pageNumber: i + 1,
    imageUrl: `/quran-pages/page${String(i + 1).padStart(3, "0")}.png`,
    surahName: getSurahNameForPage(i + 1),
    juzNumber: Math.floor(i / 20) + 1,
    hizbNumber: Math.floor(i / 8) + 1,
    surahs: getSurahsForPage(i + 1),
  }));

  // Helper function to get Surah names for a page (simplified example)
  function getSurahNameForPage(pageNumber: number): string {
    // This would be replaced with actual mapping data
    if (pageNumber === 1) return "الفاتحة";
    if (pageNumber <= 49) return "البقرة";
    if (pageNumber <= 76) return "آل عمران";
    // etc...
    return `سورة ${Math.floor(pageNumber / 20) + 1}`; // Simplified
  }

  // Helper function to get Surahs for a page (simplified example)
  function getSurahsForPage(pageNumber: number): Array<{number: number; name: string; startAyah: number; endAyah?: number}> {
    // This would be replaced with actual mapping data
    if (pageNumber === 1) return [{number: 1, name: "الفاتحة", startAyah: 1, endAyah: 7}];
    if (pageNumber === 2) return [
      {number: 2, name: "البقرة", startAyah: 1, endAyah: 20}
    ];
    // etc...
    return [{
      number: Math.floor(pageNumber / 20) + 1,
      name: `سورة ${Math.floor(pageNumber / 20) + 1}`,
      startAyah: 1
    }];
  }

  const surahs = [
    { number: 1, name: "الفاتحة", page: 1 },
    { number: 2, name: "البقرة", page: 2 },
    { number: 3, name: "آل عمران", page: 50 },
    { number: 4, name: "النساء", page: 77 },
    { number: 5, name: "المائدة", page: 106 },
    // ... and so on for all 114 surahs
  ];

  const juzs = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    name: `الجزء ${i + 1}`,
    page: i * 20 + 1,
  }));

  const currentPageData = quranPages[currentPage - 1];
  const isBookmarked = bookmarks.includes(currentPage);

  // Update last visited pages
  useEffect(() => {
    const updatedPages = [currentPage, ...lastVisitedPages.filter(p => p !== currentPage)].slice(0, 5);
    setLastVisitedPages(updatedPages);
    onPageChange(currentPage);
  }, [currentPage]);

  // Preload pages for smoother experience
  useEffect(() => {
    const pagesToPreload = [
      currentPage,
      currentPage + 1,
      currentPage + 2,
      currentPage - 1,
      currentPage - 2,
    ].filter(page => page >= 1 && page <= 604);
    
    pagesToPreload.forEach((page) => {
      const img = new Image();
      img.src = `/quran-pages/page${String(page).padStart(3, "0")}.png`;
    });
  }, [currentPage]);

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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
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
          handleBookmarkToggle();
          break;
        case " ":
          togglePlayback();
          e.preventDefault();
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
  }, [currentPage, zoomLevel]);

  // Page change handler
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= quranPages.length) {
      setCurrentPage(newPage);
      // Reset selected ayah when changing page
      setSelectedAyah(null);
    }
  }, [quranPages.length]);

  // Zoom level handler
  const handleZoomChange = useCallback((value: number[]) => {
    setZoomLevel(value[0]);
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

  // Toggle bookmark
  const handleBookmarkToggle = useCallback(() => {
    onBookmarkToggle(currentPage);
  }, [currentPage, onBookmarkToggle]);

  // Toggle recording mode
  const toggleRecording = useCallback(() => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setErrorReportType(null);
    }
  }, [isRecording]);

  // Handle ayah selection
  const handleAyahClick = useCallback((ayahNumber: number) => {
    const isAlreadySelected = selectedAyah === ayahNumber;
    
    // If we're in recording mode and have an error type selected, add a note
    if (isRecording && errorReportType && !isAlreadySelected) {
      addNote({
        id: `note-${Date.now()}`,
        pageNumber: currentPage,
        ayahNumber,
        color: getColorForErrorType(errorReportType),
        text: `${errorReportType} في الآية ${ayahNumber}`,
        timestamp: Date.now(),
        type: getTypeForErrorType(errorReportType),
      });
    }
    
    setSelectedAyah(isAlreadySelected ? null : ayahNumber);
    
    if (!isAlreadySelected) {
      onSelectionChange({
        start: ayahNumber,
        end: ayahNumber,
        pageNumber: currentPage,
      });
    }
  }, [currentPage, errorReportType, isRecording, onSelectionChange, selectedAyah]);

  // Helper function to get color for error type
  const getColorForErrorType = (type: string): string => {
    switch (type) {
      case "خطأ نطق": return "#f87171";
      case "خطأ تجويد": return "#a78bfa";
      case "خطأ حفظ": return "#fbbf24";
      default: return "#10b981";
    }
  };

  // Helper function to get note type from error type
  const getTypeForErrorType = (type: string): Note["type"] => {
    switch (type) {
      case "خطأ نطق": return "error";
      case "خطأ تجويد": return "tajweed";
      case "خطأ حفظ": return "memorization";
      default: return "note";
    }
  };

  // Add a new note
  const addNote = useCallback((note: Note) => {
    setNotes(prev => [...prev, note]);
  }, [setNotes]);

  // Delete a note
  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  }, [setNotes]);

  // Update a note
  const updateNote = useCallback((updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setEditingNote(null);
  }, [setNotes]);

  // Perform search
  const performSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulated search - in real implementation, this would search through actual Quran text
    setTimeout(() => {
      const results = [
        { pageNumber: 1, ayahNumber: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
        { pageNumber: 2, ayahNumber: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
        // More simulated results
      ].filter(item => item.text.includes(searchQuery) || 
                        item.pageNumber.toString().includes(searchQuery) ||
                        item.ayahNumber.toString().includes(searchQuery));
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  }, [searchQuery]);

  // Go to surah
  const goToSurah = useCallback((surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber);
    if (surah) {
      handlePageChange(surah.page);
      setSelectedSurah(null);
      setShowGotoDialog(false);
    }
  }, [handlePageChange]);

  // Go to juz
  const goToJuz = useCallback((juzNumber: number) => {
    const juz = juzs.find(j => j.number === juzNumber);
    if (juz) {
      handlePageChange(juz.page);
      setSelectedJuz(null);
      setShowGotoDialog(false);
    }
  }, [handlePageChange]);

  // Print current page
  const printCurrentPage = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>مصحف - صفحة ${currentPage}</title>
            <style>
              body { display: flex; justify-content: center; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="/quran-pages/page${String(currentPage).padStart(3, "0")}.png" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }, [currentPage]);

  // Share current page
  const shareCurrentPage = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `مصحف - صفحة ${currentPage}`,
        text: `أقرأ صفحة ${currentPage} من المصحف الشريف`,
        url: `${window.location.origin}?page=${currentPage}`,
      })
      .catch(error => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}?page=${currentPage}`)
        .then(() => alert('تم نسخ الرابط'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  }, [currentPage]);

  // Render recording controls
  const renderRecordingControls = useCallback(() => {
    if (!isRecording) return null;

    const errorTypes = [
      {
        label: "خطأ نطق",
        color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
      },
      {
        label: "خطأ تجويد",
        color: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
      },
      {
        label: "خطأ حفظ",
        color: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
      },
      {
        label: "ملاحظة",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
      },
    ];

    return (
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white border-red-600 flex items-center gap-1"
          onClick={toggleRecording}
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
                className={`${errorReportType === type.label ? 'ring-2 ring-offset-1 ring-blue-500' : ''} ${type.color} text-xs justify-start`}
                onClick={() => {
                  setErrorReportType(prevType => prevType === type.label ? null : type.label);
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
  }, [isRecording, errorReportType, toggleRecording]);

  // Create a grid of ayahs for the current page
  const renderAyahGrid = useCallback(() => {
    // This is a simplified approach - in a real implementation, 
    // you'd use actual ayah positions data for each page
    const ayahsPerPage = 15; // Simplified assumption
    
    return Array.from({ length: ayahsPerPage }, (_, rowIndex) => {
      const ayahNumber = rowIndex + 1;
      return (
        <div
          key={`ayah-${ayahNumber}`}
          className={cn(
            "absolute border border-transparent hover:border-emerald-300 dark:hover:border-emerald-500",
            "hover:bg-emerald-50/30 dark:hover:bg-emerald-800/20 rounded-md cursor-pointer transition-colors",
            selectedAyah === ayahNumber ? "bg-emerald-100/50 dark:bg-emerald-800/30 border-emerald-400 dark:border-emerald-600" : ""
          )}
          style={{
            top: `${(rowIndex * 100) / ayahsPerPage}%`,
            right: "5%",
            left: "5%",
            height: `${100 / ayahsPerPage}%`,
            zIndex: 10,
          }}
          onClick={() => handleAyahClick(ayahNumber)}
        />
      );
    });
  }, [handleAyahClick, selectedAyah]);

  // Notes for current page
  const pageNotes = notes.filter(note => note.pageNumber === currentPage);

  // Render highlighted ayahs and notes
  const renderHighlightsAndNotes = useCallback(() => {
    const allHighlights = [
      ...highlightedAyahs.filter(h => h.pageNumber === currentPage),
      ...pageNotes.map(note => ({
        start: note.ayahNumber,
        end: note.ayahNumber,
        pageNumber: note.pageNumber,
        color: note.color,
        note: note.text,
      })),
    ];
    
    const ayahsPerPage = 15; // Simplified assumption
    
    return allHighlights.map((highlight, index) => {
      // Calculate position based on ayah numbers
      const topPercentage = ((highlight.start - 1) * 100) / ayahsPerPage;
      const heightPercentage = ((highlight.end - highlight.start + 1) * 100) / ayahsPerPage;

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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-4 w-4 rounded-full bg-white dark:bg-gray-800 border-2" style={{ borderColor: highlight.color }}></div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="text-sm">{highlight.note}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      );
    });
  }, [highlightedAyahs, pageNotes, currentPage]);

  // Render translation overlay
  const renderTranslation = useCallback(() => {
    if (!showTranslation) return null;
    
    const translationText = translations[currentTranslation] || 
      "In the name of Allah, Most Gracious, Most Merciful. Praise be to Allah, the Cherisher and Sustainer of the Worlds.";
    
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 p-4 border-t border-gray-200 dark:border-gray-700 max-h-1/3 overflow-y-auto text-sm">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
          {currentTranslation === "english" ? "English Translation" : "الترجمة العربية"}
        </h4>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
          {translationText}
        </p>
      </div>
    );
  }, [currentTranslation, showTranslation, translations]);

  // Audio player UI
  const renderAudioPlayer = useCallback(() => {
    if (!isPlaying && audioProgress === 0) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 p-2 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2 rtl:space-x-reverse">
        <Button
          variant="ghost"
          size="icon"
          className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          onClick={togglePlayback}
        >
          {isPlaying ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
        </Button>
        
        <div className="flex-grow bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full" 
            style={{ width: `${audioProgress}%` }}
          />
        </div>
        
        <Select value={currentReciter} onValueChange={changeReciter}>
          <SelectTrigger className="w-40 text-xs border-none bg-transparent">
            <SelectValue placeholder="اختر القارئ" />
          </SelectTrigger>
          <SelectContent>
            {reciters.map(reciter => (
              <SelectItem key={reciter.id} value={reciter.id}>
                {reciter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }, [audioProgress, currentReciter, isPlaying, reciters, changeReciter, togglePlayback]);

  // Render notes management dialog
  const renderNotesDialog = useCallback(() => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          >
            <Pen className="h-4 w-4 mr-1" />
            الملاحظات
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إدارة الملاحظات</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-72 mt-4">
            {notes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center p-4">
                لا توجد ملاحظات بعد
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-md border border-gray-200 dark:border-gray-700 relative"
                    style={{
                      backgroundColor: `${note.color}10`,
                      borderLeftWidth: "4px",
                      borderLeftColor: note.color,
                    }}
                  >
                    <div className="flex justify-between">
                      <Badge variant="outline" className="mb-2">
                        صفحة {note.pageNumber} - آية {note.ayahNumber}
                      </Badge>
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setEditingNote(note)}
                        >
                          <Pen className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-600"
                          onClick={() => deleteNote(note.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{note.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </p>
                    {note.pageNumber !== currentPage && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs p-0 h-6 mt-2"
                        onClick={() => {
                          handlePageChange(note.pageNumber);
                          document.body
                            .querySelector('[role="dialog"]')
                            ?.parentElement?.click();
                        }}
                      >
                        الذهاب إلى الصفحة {note.pageNumber}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {editingNote && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">تعديل الملاحظة</h4>
              <div className="space-y-2">
                <Input
                  value={editingNote.text}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, text: e.target.value })
                  }
                  className="text-sm"
                />
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingNote(null)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateNote(editingNote)}
                  >
                    حفظ
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }, [
    notes,
    currentPage,
    editingNote,
    deleteNote,
    handlePageChange,
    updateNote,
  ]);

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
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 flex flex-wrap items-center justify-between gap-2 w-full">
        <div className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap gap-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>الصفحة السابقة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
            صفحة {currentPage} من 604
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === 604}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>الصفحة التالية</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={showGotoDialog} onOpenChange={setShowGotoDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                إنتقال إلى
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>الإنتقال إلى</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="page">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="page">الصفحة</TabsTrigger>
                  <TabsTrigger value="surah">السورة</TabsTrigger>
                  <TabsTrigger value="juz">الجزء</TabsTrigger>
                </TabsList>

                <TabsContent value="page" className="mt-2">
                  <div className="space-y-2">
                    <Label>اختر الصفحة</Label>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Input
                        type="number"
                        min={1}
                        max={604}
                        value={currentPage}
                        onChange={(e) =>
                          handlePageChange(parseInt(e.target.value) || 1)
                        }
                        className="text-center"
                      />
                      <Button onClick={() => setShowGotoDialog(false)}>
                        إنتقال
                      </Button>
                    </div>

                    {lastVisitedPages.length > 0 && (
                      <div className="mt-4">
                        <Label className="mb-2 block text-sm">
                          آخر الصفحات المزارة
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {lastVisitedPages.map((page) => (
                            <Button
                              key={page}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handlePageChange(page);
                                setShowGotoDialog(false);
                              }}
                              className="text-xs"
                            >
                              صفحة {page}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="surah" className="mt-2">
                  <div className="space-y-2">
                    <Label>اختر السورة</Label>
                    <Select
                      value={selectedSurah?.toString()}
                      onValueChange={(value) => goToSurah(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر السورة" />
                      </SelectTrigger>
                      <SelectContent>
                        {surahs.map((surah) => (
                          <SelectItem
                            key={surah.number}
                            value={surah.number.toString()}
                          >
                            {surah.number}. {surah.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="juz" className="mt-2">
                  <div className="space-y-2">
                    <Label>اختر الجزء</Label>
                    <Select
                      value={selectedJuz?.toString()}
                      onValueChange={(value) => goToJuz(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الجزء" />
                      </SelectTrigger>
                      <SelectContent>
                        {juzs.map((juz) => (
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
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-1 rtl:space-x-reverse flex-wrap gap-y-2">
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
              className="h-4 w-4 absolute left-2 rtl:left-auto rtl:right-2 top-2 text-gray-400"
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
                        handlePageChange(result.pageNumber);
                        setSearchResults([]);
                      }}
                    >
                      <p className="text-xs font-medium">
                        صفحة {result.pageNumber} - آية {result.ayahNumber}
                      </p>
                      <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                        {result.text}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmarkToggle}
                  className={isBookmarked ? "text-amber-500" : ""}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isBookmarked ? "إزالة الإشارة" : "إضافة إشارة"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={togglePlayback}>
                  <Volume2 className="h-4 w-4" />
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
                  onClick={toggleRecording}
                  className={isRecording ? "text-red-500" : ""}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {renderNotesDialog()}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={printCurrentPage}>
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>طباعة الصفحة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={shareCurrentPage}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>مشاركة</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
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
                  <Label htmlFor="translation-select" className="text-sm">
                    لغة الترجمة
                  </Label>
                  <Select
                    value={currentTranslation}
                    onValueChange={setCurrentTranslation}
                    disabled={!showTranslation}
                  >
                    <SelectTrigger id="translation-select">
                      <SelectValue placeholder="اختر اللغة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="urdu">اردو</SelectItem>
                      <SelectItem value="french">Français</SelectItem>
                      <SelectItem value="german">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm">حجم الصفحة</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <ZoomOut className="h-4 w-4 text-gray-500" />
                    <Slider
                      value={[zoomLevel]}
                      min={50}
                      max={150}
                      step={10}
                      onValueChange={handleZoomChange}
                      className="flex-1"
                    />
                    <ZoomIn className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    {zoomLevel}%
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

      {/* Content */}
      <Card className="flex-1 overflow-hidden border-0 shadow-none bg-transparent">
        <CardContent className="flex items-center justify-center p-0 h-full relative">
          {/* Page metadata display */}
          <div className="absolute top-2 right-2 z-20 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-md py-1 px-2 text-xs shadow-sm">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              >
                {currentPageData.surahName}
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                الجزء {currentPageData.juzNumber}
              </Badge>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              >
                الحزب {currentPageData.hizbNumber}
              </Badge>
            </div>
          </div>

          {/* Recording controls */}
          {renderRecordingControls()}

          {/* Main Quran page */}
          <div
            className="relative rounded-md overflow-hidden"
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

            {/* Actual Quran page image with fallback */}
            <img
              src={currentPageData.imageUrl}
              alt={`صفحة ${currentPage} من المصحف الشريف`}
              className="max-h-full max-w-full object-contain"
              style={{
                filter: darkMode ? "invert(0.85) hue-rotate(180deg)" : "none",
              }}
              onError={(e) => {
                // If image fails to load, we already have fallback content rendered
                console.log(`Failed to load image for page ${currentPage}`);
                // Hide the broken image
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* Translation overlay */}
          {renderTranslation()}

          {/* Audio player */}
          {renderAudioPlayer()}
        </CardContent>
      </Card>
    </div>
  );
};

// Default export with memo for performance optimization
export default React.memo(QuranViewer);
