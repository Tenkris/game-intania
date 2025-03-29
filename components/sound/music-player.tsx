"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import volumeOnIcon from "@/app/assets/icons/volume-on.png";
import volumeOffIcon from "@/app/assets/icons/volume-off.png";
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
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(src);

    // Configure audio
    audioRef.current.loop = loop;
    audioRef.current.volume = 0.5;

    // Add event listeners
    audioRef.current.addEventListener("canplaythrough", () => {
      setIsLoaded(true);
      if (autoPlay) {
        playAudio();
      }
    });

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [src, autoPlay, loop]);

  // Play/pause control
  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      // Use user interaction to start playing (to handle autoplay restrictions)
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Playback failed:", error);
          });
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
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
        {isPlaying && <Volume2 />}
        {!isPlaying && <VolumeOff />}
      </button>
    </div>
  );
}
