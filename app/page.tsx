import { Footer } from "@/components/ui/footer";
import AuthButton from "../components/AuthButton";
import { MacBook } from "./MacBook";
import { ShootingStarsAndStarsBackgroundDemo } from "./ShootingStarsDemo";
import { StoryDemo } from "./StoryDemo";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col items-center h-screen text-gray-400">
      <nav className="w-full flex felx-row items-center h-16">
        <div className="w-full flex justify-end p-3 mr-6 text-md font-semibold uppercase">
          <AuthButton />
        </div>
      </nav>
      <ShootingStarsAndStarsBackgroundDemo />

      <main className="flex flex-col w-full px-40 pt-16">
        <MacBook />
        <StoryDemo />
      </main>

      <footer className="w-full text-xs">
        <Footer />
      </footer>
    </div>
  );
}
