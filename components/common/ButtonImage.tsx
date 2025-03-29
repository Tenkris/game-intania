import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import longButtonImg from "@/app/assets/button/long_button.png";

export default function ButtonImage({ src = longButtonImg, alt = "button", children, onClick , type}: { src?: string | StaticImageData, alt?: string , children: ReactNode | string, onClick?: () => void, type?: "button" | "submit" | "reset" | undefined }) {
    return (
        <div className={`relative w-full`}>
            <Image src={src} width = {640} height = {640} alt={alt} className="absolute top-0 left-0 w-full h-full z-[-1] [image-rendering:pixelated]" />
            <button type={type} onClick={onClick} className="px-4 py-2 w-full h-full">{children}</button>
        </div>
    );
}