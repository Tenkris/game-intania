"use client";
import { useEffect } from "react";
import { useBackgroundImage } from "./BackgroundImageCtx";

export default function LoadDefaultBackground({children}: {children?: React.ReactNode}) {
    const { setBackgroundSrc } = useBackgroundImage();
    useEffect (() => {
        setBackgroundSrc("https://s3.imjustin.dev/hackathon/map_day.webp");
    }
    , []);
    return (
        children
    ) 
  }