import { Geist } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import backgroundImage from "@/app/assets/bg/background-new.jpeg";
import { Press_Start_2P } from "next/font/google";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Realms of Math",
  description: "The best way to up your math game!",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.className} ${pressStart.className}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground w-screen h-screen relative">
        <div className="w-full h-full">
          <div className="absolute -z-50 w-full h-full">
            <Image
              src="https://s3.imjustin.dev/hackathon/map_day.webp"
              alt="background"
              width={1920}
              height={1080}
              className="w-full h-full object-cover object-center"
            />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
