'use client';

import React, { createContext, useContext, useState } from 'react';

type BackgroundImageContextType = {
  backgroundSrc: string | null;
  setBackgroundSrc: (src: string) => void;
};

const BackgroundImageContext = createContext<BackgroundImageContextType | undefined>(undefined);

export const BackgroundImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(
    null
  );

  return (
    <BackgroundImageContext.Provider value={{ backgroundSrc, setBackgroundSrc }}>
      {children}
    </BackgroundImageContext.Provider>
  );
};

export const useBackgroundImage = () => {
  const context = useContext(BackgroundImageContext);
  if (!context) {
    throw new Error('useBackgroundImage must be used within BackgroundImageProvider');
  }
  return context;
};