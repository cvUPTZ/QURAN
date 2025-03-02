import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";

interface QuranAudioPlayerProps {
  audioUrls: string[];
  onPlaybackComplete?: () => void;
  autoPlay?: boolean;
  reciters?: { id: string; name: string }[];
  currentReciter?: string;
  onReciterChange?: (reciterId: string) => void;
}

const QuranAudioPlayer: React.FC<QuranAudioPlayerProps> = ({
  audioUrls = [],
  onPlaybackComplete = () => {},
  autoPlay = false,
  reciters = [
    { id: "ar.alafasy", name: "مشاري راشد العفاسي" },
    { id: "ar.abdulbasitmurattal", name: "عبد الباسط عبد الصمد" },
    { id: "ar.husary", name: "محمود خليل الحصري" },
    { id: "ar.shaatree", name: "أبو بكر الشاطري" },
    { id: "ar.ahmedajamy", name: "أحمد العجمي" },
  ],
  currentReciter = "ar.alafasy",
  onReciterChange = () => {},
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    // Set up event listeners
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
      if (autoPlay) {
        audio.play().catch(handlePlayError);
      }
    };
    const handleEnded = () => {
      // Move to next ayah or complete playback
      if (currentAyahIndex < audioUrls.length - 1) {
        setCurrentAyahIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
        setProgress(0);
        setCurrentAyahIndex(0);
        onPlaybackComplete();
      }
    };
    const handleError = () => {
      setIsLoading(false);
      setError("Error loading audio");
      console.error("Audio error:", audio.error);

      // If we can't load the audio, simulate playback for demo purposes
      simulatePlayback();
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Set volume
    audio.volume = volume / 100;
    audio.muted = isMuted;

    return () => {
      // Clean up event listeners
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);

      // Clear any intervals
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Handle audio URL changes
  useEffect(() => {
    if (audioUrls.length > 0 && currentAyahIndex < audioUrls.length) {
      loadAudio(audioUrls[currentAyahIndex]);
    }
  }, [audioUrls, currentAyahIndex]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(handlePlayError);
        }

        // Start progress tracking
        startProgressTracking();
      } else {
        audioRef.current.pause();

        // Stop progress tracking
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle mute state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Load audio function
  const loadAudio = (url: string) => {
    if (audioRef.current) {
      setIsLoading(true);
      setError(null);
      audioRef.current.src = url;
      audioRef.current.load();
    }
  };

  // Start progress tracking
  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = window.setInterval(() => {
      if (audioRef.current) {
        const currentProgress =
          (audioRef.current.currentTime / (audioRef.current.duration || 1)) *
          100;
        setProgress(currentProgress);
      }
    }, 100) as unknown as number;
  };

  // Handle play error
  const handlePlayError = (error: any) => {
    console.error("Error playing audio:", error);
    setError("Error playing audio");

    // Simulate playback for demo purposes
    simulatePlayback();
  };

  // Simulate playback for demo purposes
  const simulatePlayback = () => {
    setIsPlaying(true);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    let simulatedProgress = 0;
    progressIntervalRef.current = window.setInterval(() => {
      simulatedProgress += 1;
      setProgress(simulatedProgress);

      if (simulatedProgress >= 100) {
        clearInterval(progressIntervalRef.current as number);
        progressIntervalRef.current = null;

        // Move to next ayah or complete playback
        if (currentAyahIndex < audioUrls.length - 1) {
          setCurrentAyahIndex((prev) => prev + 1);
          simulatedProgress = 0;
          startSimulatedPlayback();
        } else {
          setIsPlaying(false);
          setProgress(0);
          setCurrentAyahIndex(0);
          onPlaybackComplete();
        }
      }
    }, 100) as unknown as number;
  };

  // Start simulated playback
  const startSimulatedPlayback = () => {
    setTimeout(simulatePlayback, 500);
  };

  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Skip to next ayah
  const nextAyah = () => {
    if (currentAyahIndex < audioUrls.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
      setProgress(0);
    }
  };

  // Skip to previous ayah
  const previousAyah = () => {
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  // Handle progress change
  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    setProgress(newProgress);

    if (audioRef.current) {
      const newTime = (newProgress / 100) * (audioRef.current.duration || 0);
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle reciter change
  const handleReciterChange = (reciterId: string) => {
    onReciterChange(reciterId);
  };

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Calculate current time
  const currentTime = audioRef.current
    ? formatTime(audioRef.current.currentTime)
    : formatTime((progress / 100) * (duration || 0));

  // Format total duration
  const totalDuration = formatTime(duration);

  // Get volume icon based on volume level and mute state
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 50) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Playback controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousAyah}
            disabled={currentAyahIndex === 0 || isLoading}
            className="text-gray-700 dark:text-gray-300"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayback}
            disabled={isLoading || audioUrls.length === 0}
            className="text-emerald-600 dark:text-emerald-400 h-10 w-10"
          >
            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent animate-spin" />
            ) : isPlaying ? (
              <PauseCircle className="h-8 w-8" />
            ) : (
              <PlayCircle className="h-8 w-8" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextAyah}
            disabled={currentAyahIndex === audioUrls.length - 1 || isLoading}
            className="text-gray-700 dark:text-gray-300"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-center">
            {currentTime}
          </span>

          <div className="w-32 md:w-48">
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={0.1}
              onValueChange={handleProgressChange}
              disabled={isLoading || audioUrls.length === 0}
              className="cursor-pointer"
            />
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] text-center">
            {totalDuration}
          </span>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-gray-700 dark:text-gray-300"
          >
            {getVolumeIcon()}
          </Button>

          <div className="w-20 hidden md:block">
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>

          <Select value={currentReciter} onValueChange={handleReciterChange}>
            <SelectTrigger className="w-32 md:w-40 text-xs border-none">
              <SelectValue placeholder="اختر القارئ" />
            </SelectTrigger>
            <SelectContent>
              {reciters.map((reciter) => (
                <SelectItem key={reciter.id} value={reciter.id}>
                  {reciter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-500 dark:text-red-400 text-center mt-1">
          {error}
        </div>
      )}

      {/* Ayah progress indicator */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          الآية {currentAyahIndex + 1} من {audioUrls.length}
        </span>

        <div className="flex-1 mx-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
            style={{
              width: `${(currentAyahIndex / (audioUrls.length || 1)) * 100}%`,
            }}
          />
        </div>

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round((currentAyahIndex / (audioUrls.length || 1)) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default QuranAudioPlayer;
