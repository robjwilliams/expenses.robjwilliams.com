import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="h-full bg-neutral-900 flex flex-col items-center justify-center fixed inset-0 w-full -z-10">
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
