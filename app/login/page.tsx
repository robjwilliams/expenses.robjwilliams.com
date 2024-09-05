import { Metadata } from "next";
import Image from "next/image";

import { UserAuthForm } from "./components/user-auth-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none grid-col-1 md:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="hidden relative z-20 md:flex items-center text-lg font-medium gap-2">
            <Image src="/cookie.svg" alt="Cookie" width={24} height={24} />
            Spent it all on cookies
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                Let&apos;s save some money or not...
              </h1>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
}
