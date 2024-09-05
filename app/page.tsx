import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import Image from "next/image";
// import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {user ? (
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="login"
            >
              login
            </Link>
          ) : (
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              href="overview"
            >
              Dashboard
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Another Expense Tracker APP
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A tool built because I was to lazy to manually upload my
                  expenses
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How does it work?
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold">Automatic Purchase Upload</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  It works by scraping your account on the places you buy
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold">Analytics</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Display relevant data so you can be financially responsible
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold">Report Generation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Recurrent report comparing with previous dates and AI
                  generated recommendations
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Wanna use the tool or work together?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Reach out and let&apos;s schedule a meeting
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href={siteConfig.url}>
                  <Button>Click Me</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t"></footer>
    </div>
  );
}
