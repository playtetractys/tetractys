import { useEffect, useCallback, useState, useRef } from "react";

declare global {
  interface Window {
    AZOTHEOS_AUTOPLAY?: boolean;
  }
}

export function StepAudio({ audio, handleAutoPlay = false }: { audio: string; handleAutoPlay?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio(audio);

    if (isPlaying) {
      audioRef.current.pause();
      if (handleAutoPlay) window.AZOTHEOS_AUTOPLAY = false;
    } else {
      audioRef.current.play();
      if (handleAutoPlay) window.AZOTHEOS_AUTOPLAY = true;
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, audio, handleAutoPlay]);

  useEffect(() => {
    audioRef.current = new Audio(audio);
    audioRef.current.oncanplay = () => {
      if (handleAutoPlay && window.AZOTHEOS_AUTOPLAY) {
        setTimeout(() => {
          setIsPlaying(true);
          audioRef.current?.play();
        }, 1_500);
      }
    };

    return () => audioRef.current?.pause();
  }, [audioRef, audio, handleAutoPlay]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      audioRef.current.onpause = () => {
        setIsPlaying(false);
      };
      audioRef.current.onplay = () => {
        setIsPlaying(true);
      };
    }
  }, [isPlaying]);

  return (
    <button
      onClick={toggleAudio}
      className="rounded-full border-purple-400/30 hover:border-purple-400 border-1 hover:bg-purple-400/10 transition-colors"
      aria-label={isPlaying ? "Pause narration" : "Play narration"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-purple-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {isPlaying ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 9v6m4-6v6" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
        )}
      </svg>
    </button>
  );
}
