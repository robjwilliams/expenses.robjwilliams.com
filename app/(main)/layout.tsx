import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

import { Sidebar } from "@/components/ui/navigation/sidebar";
// import { siteConfig } from "./siteConfig";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { siteConfig } from "../siteConfig";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoururl.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [],
  authors: [
    {
      name: "yourname",
      url: "",
    },
  ],
  creator: "yourname",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tremor OSS Dashboard",
    creator: "@tremorlabs",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-y-scroll scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
        suppressHydrationWarning
      >
        <div className="max-w-screen">
          <ThemeProvider defaultTheme="system" attribute="class">
            {user && <Sidebar />}
            <main className={`${user ? "lg:pl-72" : ""} w-full h-screen`}>
              <div className="p-10">{children}</div>
            </main>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
