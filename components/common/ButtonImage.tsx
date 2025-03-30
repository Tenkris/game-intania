import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import longButtonImg from "@/app/assets/button/long_button.png";

export default function ButtonImage({
  src = longButtonImg,
  alt = "button",
  children,
  onClick,
  type,
  disabled = false,
}: {
  src?: string | StaticImageData;
  alt?: string;
  children: ReactNode | string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
}) {
  return (
    <div className={`relative w-full mx-2 py-2 px-2 my-2 z-30`}>
      <Image
        src={src}
        width={640}
        height={640}
        alt={alt}
        className={`absolute top-0 left-0 w-full h-full z-[-1] [image-rendering:pixelated] ${disabled ? "opacity-50" : ""}`}
      />
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 w-full h-full ${disabled ? "opacity-50" : ""}`}
      >
        {children}
      </button>
    </div>
  );
}
