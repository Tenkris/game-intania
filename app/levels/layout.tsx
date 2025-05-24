import ButtonImage from "@/components/common/ButtonImage";
import Link from "next/link";

export default function LevelsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-black/80 relative">
      <div className="fixed z-[100] top-0 left-0">
        <ButtonImage>
          <Link href="/" className="w-full text-center block">
            Back
          </Link>
        </ButtonImage>
      </div>
      <div>{children}</div>
    </div>
  );
}
