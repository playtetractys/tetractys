"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Services
import { useSoilContext } from "@/soil/context";
import { useFullStory } from "@/hooks/useFullStory";

// Components
import { Auth } from "@/components/auth";
import { Drawer } from "@/components/drawer";
import { CreditsModal } from "@/components/credits-modal";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { userData, initiallyLoading, userState, isCreditsModalOpen, setIsCreditsModalOpen } = useSoilContext();

  useFullStory();
  const pathname = usePathname();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  if (initiallyLoading || userData === undefined) return null;

  if (userData === null) {
    return (
      <div className="grow p-4 max-w-lg w-full mx-auto flex flex-col justify-center items-center text-white py-12">
        <Image
          src="/tetractys.png"
          alt="Tetractys Logo"
          priority
          width={200}
          height={200}
          className="max-w-[180px] md:max-w-full invert"
        />

        <h1 className="text-[42px] md:text-5xl font-mono mt-3">tetractys</h1>

        <p className="mt-7 mb-20 md:text-lg text-center italic font-serif">
          A Game of Galactic Exploration and Conquest
        </p>

        <Auth />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center min-h-svh p-4">
      <Drawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} pathname={pathname} />
      <CreditsModal isOpen={isCreditsModalOpen} onClose={() => setIsCreditsModalOpen(false)} pathname={pathname} />

      <header className="z-10 p-4 absolute top-0 left-0 w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="btn-grow fill-white hover:fill-white/90 duration-200 transition-colors"
          >
            <Image src="/drawer-icon.svg" alt="Open drawer" priority width={35} height={35} />
          </button>
          <Link href="/t" className="relative" style={{ bottom: 1 }}>
            <Image src="/plus-icon.svg" alt="Create new Tetractys" priority width={30} height={30} />
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreditsModalOpen(true)}
            style={{ top: 1 }}
            className={`relative flex items-center gap-2 ${
              (userState?.aiCredits ?? 0) <= 0 ? "btn-ghost-red" : "btn-ghost"
            }`}
          >
            {userState?.aiCredits ?? 0}
            <Image src="/tetractys.png" alt="Buy credits" priority width={15} height={15} className="invert" />
          </button>
          <Link
            href="/account"
            className="border-1 border-black bg-white hover:bg-white/90 rounded-full p-2 fill-black duration-200 transition-colors btn-grow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={18} height={18} x="0px" y="0px">
              <path d="M1.17,512c-2.59-29-1.17-57.18,7.3-84.3,5.28-16.92,18.76-27.87,35.27-33.06,23.5-7.39,47.6-12.83,71.2-19.92,14-4.22,28.2-8.8,41.28-15.32,29.68-14.79,34.58-36.16,20.77-66.69-15.31-33.84-29.43-68.44-41-103.73-10.59-32.26-11-65.91-2.3-99.36C146.24,41.24,182,8.73,231.43,1.93,267.26-3,301.46.66,331.89,22.78c45.36,33,53.85,80.44,48.57,131.8-4.91,47.72-22.11,92-44.3,134.21-19,36.13-11.85,59.09,25.89,74,24.61,9.7,50.73,15.45,76.16,23,10.44,3.11,21.27,5.4,31.17,9.78,19.24,8.5,33.43,22.06,35.81,44.57,2.49,23.58,4.49,47.21,6.8,71.87H1.17Z" />
            </svg>
          </Link>
        </div>
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col items-center py-12">{children}</main>
    </div>
  );
}
