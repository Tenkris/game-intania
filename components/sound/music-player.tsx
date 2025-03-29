"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeOff } from "lucide-react";

interface MusicPlayerProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export default function MusicPlayer({
  src,
  autoPlay = true,
  loop = true,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Start as not playing regardless of autoPlay
  const [isLoaded, setIsLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(src);

    // Configure audio
    audioRef.current.loop = loop;
    audioRef.current.volume = 0.3;
    audioRef.current.preload = "auto";

    // Add event listeners
    audioRef.current.addEventListener("canplaythrough", () => {
      setIsLoaded(true);
      // Don't try to autoplay here - browser will block it
    });

    // Add a document-level click listener to detect first interaction
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      // Only try to play if autoPlay was requested
      if (autoPlay && audioRef.current && isLoaded) {
        tryPlayAudio();
      }
      // Remove the listener after first interaction
      document.removeEventListener("click", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [src, autoPlay, loop, isLoaded]);

  // When user has interacted and audio is loaded, try playing if autoPlay is true
  useEffect(() => {
    if (userInteracted && isLoaded && autoPlay && audioRef.current) {
      tryPlayAudio();
    }
  }, [userInteracted, isLoaded, autoPlay]);

  // Try to play audio and handle promise properly
  const tryPlayAudio = () => {
    if (!audioRef.current) return;

    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log(
            "Playback failed, will try again on user interaction:",
            error
          );
          setIsPlaying(false);
        });
    }
  };

  // Play/pause control
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      tryPlayAudio();
    }

    // Mark that user has interacted
    setUserInteracted(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleAudio}
        className="bg-black/40 backdrop-blur-sm p-2 rounded-full hover:bg-black/60 transition-colors duration-300"
        disabled={!isLoaded}
        title={isPlaying ? "Mute" : "Unmute"}
        aria-label={isPlaying ? "Mute" : "Unmute"}
      >
        {isPlaying && <Volume2 className="text-white" />}
        {!isPlaying && <VolumeOff className="text-white" />}
      </button>

      {/* Audio status for debugging - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-16 right-4 text-xs text-white bg-black/50 p-1 rounded">
          {!isLoaded
            ? "Loading..."
            : !userInteracted
              ? "Waiting for interaction..."
              : isPlaying
                ? "Playing"
                : "Paused"}
        </div>
      )}
    </div>
  );
}
