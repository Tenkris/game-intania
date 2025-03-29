import React from "react";
import attackLogo from "@/app/assets/hud/attack-logo.webp";
import defenseLogo from "@/app/assets/hud/defense-logo.webp";
import signImageCropped from "@/app/assets/hud/sign-cropped.webp";
import Image from "next/image";

function PlayerStats({ attack, defense }: { attack: number; defense: number }) {
  return (
    <div className="flex flex-col gap-2 absolute bottom-12 w-full items-center">
      <div className="grid grid-cols-2 justify-center items-center max-w-60 gap-10 relative w-full">
        <Image
          src={signImageCropped}
          alt="Level Sign"
          className="object-cover object-center absolute -z-10 [image-rendering:pixelated]"
        />
        <div className="flex flex-col items-center ml-5 gap-1">
          <Image
            src={attackLogo}
            alt="Attack"
            className="size-16  [image-rendering:pixelated]"
          />
          <span className="text-sm font-bold text-black">{attack}</span>
        </div>
        <div className="flex flex-col items-center mr-5 gap-1">
          <Image
            src={defenseLogo}
            alt="Attack"
            className="size-16 [image-rendering:pixelated]"
          />
          <span className="text-sm font-bold text-black">{attack}</span>
        </div>
      </div>
    </div>
  );
}

export default PlayerStats;
