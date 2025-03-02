import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { RefreshCw, Volume2, Copy, Share2 } from "lucide-react";

interface QuranVerseProps {
  verse?: {
    arabic: string;
    translation: string;
    surah: string;
    ayah: number;
    reference: string;
  };
  onRefresh?: () => void;
}

const defaultVerse = {
  arabic:
    "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا لِي وَلْيُؤْمِنُوا بِي لَعَلَّهُمْ يَرْشُدُونَ",
  translation:
    "And when My servants ask you concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me and believe in Me that they may be guided.",
  surah: "البقرة",
  ayah: 186,
  reference: "سورة البقرة - آية ١٨٦",
};

const QuranVerse = ({
  verse = defaultVerse,
  onRefresh = () => {},
}: QuranVerseProps) => {
  const [currentVerse, setCurrentVerse] = useState(verse);

  // Simulate verse refresh effect
  useEffect(() => {
    setCurrentVerse(verse);
  }, [verse]);

  const handleRefresh = () => {
    onRefresh();
  };

  const handlePlayAudio = () => {
    // Placeholder for audio playback functionality
    console.log("Playing audio for verse");
  };

  const handleCopy = () => {
    // Placeholder for copy functionality
    const textToCopy = `${currentVerse.arabic}\n\n${currentVerse.translation}\n\n${currentVerse.reference}`;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleShare = () => {
    // Placeholder for share functionality
    console.log("Sharing verse");
  };

  return (
    <Card className="w-full max-w-[750px] h-[350px] overflow-hidden bg-[#f8f7f2] border-[#d4b106] border-2 shadow-lg">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#1e5f74]">آية اليوم</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  className="text-[#1e5f74] hover:text-[#d4b106] hover:bg-[#f0edd6]"
                >
                  <RefreshCw size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>تحديث الآية</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="mb-4">
            <p
              className="text-right text-2xl leading-relaxed font-quran mb-6"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {currentVerse.arabic}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {currentVerse.translation}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-[#1e5f74] font-semibold">
              {currentVerse.reference}
            </div>

            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePlayAudio}
                      className="text-[#1e5f74] hover:text-[#d4b106] hover:bg-[#f0edd6]"
                    >
                      <Volume2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>استماع</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className="text-[#1e5f74] hover:text-[#d4b106] hover:bg-[#f0edd6]"
                    >
                      <Copy size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>نسخ</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="text-[#1e5f74] hover:text-[#d4b106] hover:bg-[#f0edd6]"
                    >
                      <Share2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>مشاركة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuranVerse;
