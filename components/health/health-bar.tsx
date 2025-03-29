import Image from "next/image";
import fullHeart from "@/app/assets/hud/hardcore_full.png";
import halfHeart from "@/app/assets/hud/hardcore_half.png";
import emptyHeart from "@/app/assets/hud/container_hardcore.png";

export default function HealthBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const size = 24;
  const hearts = [];
  const totalHearts = 10;
  const fullHearts = Math.floor(value / (max / totalHearts));

  for (let i = 0; i < totalHearts; i++) {
    hearts.push(
      <div key={i} className="relative">
        <Image
          src={emptyHeart}
          alt="Empty Heart"
          width={size}
          height={size}
          className="[image-rendering:pixelated]"
        />
        {i < fullHearts && (
          <Image
            src={fullHeart}
            alt="Full Heart"
            width={size}
            height={size}
            className="absolute top-0 left-0 [image-rendering:pixelated]"
          />
        )}
        {i === fullHearts && value % (max / totalHearts) > 0 && (
          <Image
            src={halfHeart}
            alt="Half Heart"
            width={size}
            height={size}
            className="absolute top-0 left-0 [image-rendering:pixelated]"
          />
        )}
      </div>
    );
  }

  return <div className="flex gap-0.5">{hearts}</div>;
}
