"use client";

import { User } from "@/types/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import signTallImage from "@/app/assets/hud/sign-tall.webp";

const gamblingItems = [
    { label: "+ 5 ATK", attribute: "attack", value: 5 },
    { label: "+ 5 ATK", attribute: "attack", value: 5 },
    { label: "+ 10 ATK", attribute: "attack", value: 10 },
    { label: "+ 15 ATK", attribute: "attack", value: 15 },
    { label: "+ 20 ATK", attribute: "attack", value: 20 },
    { label: "+ 25 ATK", attribute: "attack", value: 25 },
    { label: "+ 30 ATK", attribute: "attack", value: 30 },
    { label: "+ 35 ATK", attribute: "attack", value: 35 },
    { label: "+ 5 DEF", attribute: "defense", value: 5 },
    { label: "+ 5 DEF", attribute: "defense", value: 5 },
    { label: "+ 10 DEF", attribute: "defense", value: 10 },
    { label: "+ 15 DEF", attribute: "defense", value: 15 },
    { label: "+ 20 DEF", attribute: "defense", value: 20 },
    { label: "+ 25 DEF", attribute: "defense", value: 25 },
    { label: "+ 30 DEF", attribute: "defense", value: 30 },
    { label: "+ 35 DEF", attribute: "defense", value: 35 },
    { label: "+ 5 HP", attribute: "hp", value: 5 },
    { label: "+ 5 HP", attribute: "hp", value: 5 },
    { label: "+ 10 HP", attribute: "hp", value: 10 },
    { label: "+ 15 HP", attribute: "hp", value: 15 },
    { label: "+ 20 HP", attribute: "hp", value: 20 },
    { label: "+ 25 HP", attribute: "hp", value: 25 },
    { label: "+ 30 HP", attribute: "hp", value: 30 },
    { label: "+ 35 HP", attribute: "hp", value: 35 },
    { label: "Bad Luck!", attribute: "attack", value: 0 },
    { label: "Unlucky!", attribute: "attack", value: 0 },
    { label: "No Reward!", attribute: "attack", value: 0 },
    { label: "Oh no!", attribute: "attack", value: 0 },
    { label: "Good Bye!", attribute: "attack", value: 0 },
    { label: "Why do you gamble?", attribute: "attack", value: 0 },
]

export default function GamblingCarousel({ updateUser }: { updateUser: (field: keyof User, value: number) => Promise<void> }) {
    const router = useRouter();

    const [isSpinning, setIsSpinning] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const SoundManager = {
        sounds: {} as Record<string, HTMLAudioElement>,
      
        preload: (soundId: string, url: string, volume: number = 1.0) => {
          const audio = new Audio(url);
          audio.volume = volume;
          // Preload the audio
          audio.load();
          SoundManager.sounds[soundId] = audio;
        },
      
        play: (soundId: string) => {
          const sound = SoundManager.sounds[soundId];
          if (sound) {
            // Clone the audio element to allow overlapping sounds
            const clone = sound.cloneNode() as HTMLAudioElement;
            clone.volume = sound.volume;
            clone.play();
          }
        },
      };


    function handleSpin(delay: number) {
        setIsSpinning(true);
        
        // Set the current index randomly which is not the same as the previous one
        let randomIndex = Math.floor(Math.random() * gamblingItems.length);
        while (randomIndex === currentIndex) {
            randomIndex = Math.floor(Math.random() * gamblingItems.length);
        }
        setCurrentIndex(randomIndex);

        if (delay > 1200) {
            setIsSpinning(false);
            SoundManager.play("reward");
            setTimeout(async () => {
                await updateUser(gamblingItems[randomIndex].attribute as keyof User, gamblingItems[randomIndex].value);
            }, 2000)
            return;
        }
        
        SoundManager.play("spin");

        setTimeout(() => {
            handleSpin(delay * 1.1)
        }, delay);

        
    }

    useEffect(() => {
        setTimeout(() => {
            handleSpin(10)
        }, 100)
        
    }, [])

    useEffect(() => {
        SoundManager.preload("spin", "https://s3.imjustin.dev/hackathon/spin.mp3", 0.8);
        SoundManager.preload("reward", "https://s3.imjustin.dev/hackathon/slot-machine.wav", 0.8);
    }, [])

    
    return (
        <>
            <div className="w-[40rem] h-[30rem] flex flex-col justify-center items-center rounded-lg relative">
                <Image
                    src={signTallImage}
                    alt="Button Sign"
                    className="w-full h-full absolute  top-0 -z-[1] left-0 [image-rendering:pixelated]"
                    />
                <h1 className="text-2xl font-bold mb-4">Gambling</h1>
                <div className="flex items-center justify-center gap-2">
                    <div className={`w-64 h-64 rounded-lg flex items-center justify-center ${(isSpinning ? "bg-slate-200" : "bg-yellow-500")}`}>
                        <h2 className="text-xl font-bold text-center">{gamblingItems[currentIndex].label}</h2>
                    </div>
                </div>
            </div>
        </>
        
    )

}