import Image from "next/image";
import fullHeart from "@/app/assets/hud/hardcore_full.png";
import halfHeart from "@/app/assets/hud/hardcore_half.png";
import emptyHeart from "@/app/assets/hud/container_hardcore.png";
import healthBar from "@/app/assets/hud/health-bar.webp";

export default function HealthBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  // Calculate percentage of health remaining
  const healthPercentage = Math.max(0, Math.min(100, (value / max) * 100));

  // Determine color based on health percentage
  const getHealthColor = () => {
    if (healthPercentage > 60) return "#4ade80"; // Green
    if (healthPercentage > 30) return "#facc15"; // Yellow
    return "#ef4444"; // Red
  };

  // Calculate transition speed - faster when health is critical
  const transitionSpeed = healthPercentage < 20 ? "0.3s" : "0.5s";

  return (
    <div className="flex flex-col w-full gap-1 relative">
      {/* Health percentage text */}
      <div className="flex justify-between items-center text-xs px-1 font-mono">
        <span className="text-white opacity-80">HP</span>
        <span
          className={`font-bold ${
            healthPercentage > 60
              ? "text-green-400"
              : healthPercentage > 30
                ? "text-yellow-400"
                : "text-red-400"
          }`}
        >
          {Math.ceil(value)}/{max}
        </span>
      </div>

      {/* Health bar background */}
      <div className="h-full w-full bg-gray-800 rounded-sm  relative">
        <Image
          src={healthBar}
          alt="Health Bar Background"
          className="[image-rendering:pixelated] z-50 relative scale-105"
        />
        {/* Animated health bar foreground */}
        <div
          className="absolute top-0 left-0 h-full rounded-sm z-10"
          style={{
            width: `${healthPercentage}%`,
            backgroundColor: getHealthColor(),
            transition: `width ${transitionSpeed} ease-out, background-color 0.3s`,
          }}
        />

        {/* Decorative texture overlay */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)",
            backgroundSize: "10px 10px",
          }}
        />

        {/* Top highlight */}
        {/* <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-20" /> */}
      </div>

      {/* Low health pulse animation */}
      {healthPercentage <= 20 && (
        <style jsx global>{`
          @keyframes pulse-danger {
            0%,
            100% {
              opacity: 0.8;
            }
            50% {
              opacity: 1;
              box-shadow: 0 0 5px #ef4444;
            }
          }

          .health-bar-container div:first-child {
            animation: pulse-danger 0.8s ease-in-out infinite;
          }
        `}</style>
      )}
    </div>
  );
}
