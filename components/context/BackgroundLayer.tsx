"use client";
import { use, useEffect } from "react";
import { useBackgroundImage } from "./BackgroundImageCtx";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function BackgroundLayer() {
    const { backgroundSrc, setBackgroundSrc } = useBackgroundImage();
    const defaultBackgroundSrc = "https://s3.imjustin.dev/hackathon/map_day.webp";
    const pathname = usePathname();

    useEffect(() => {
        if (pathname !== "/game") {
            setBackgroundSrc(
                defaultBackgroundSrc
            );
        }
        
    }, [pathname]);

  
    return (
      <div className="fixed -z-50 w-full h-full">
        {(backgroundSrc !== defaultBackgroundSrc || pathname !== "/game") ? (
        <Image
          src={backgroundSrc}
          alt="background"
          fill
          className="object-cover object-center"
          priority
        />) :
        <div className="w-full h-full bg-black"/>
        }
      </div>
    );
  }