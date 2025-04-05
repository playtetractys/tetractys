"use client";

import Image from "next/image";
import Link from "next/link";

// Services
import { getCreditSessionUrl } from "@/services/api";
import { useSoilContext } from "@/soil/context";

// Components
import { TetractysHistory } from "./tetractys-history";

export function Drawer({
  isDrawerOpen,
  setIsDrawerOpen,
  pathname,
}: {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
  pathname: string;
}) {
  const { credits, setIsCreditsModalOpen } = useSoilContext();

  return (
    <>
      {/* Drawer overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-900 p-4 transform transition-transform z-50 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex justify-between items-center mb-12">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <Image src="/tetractys.png" className="invert" alt="Tetractys" width={24} height={24} />
                  <h1 className="text-xl font-mono font-extralight">tetractys</h1>
                </div>
              </Link>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 hover:bg-zinc-700 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  className="fill-white"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Link href="/offering" className="btn">
                Offerings
              </Link>
            </div>
            <TetractysHistory onItemClick={() => setIsDrawerOpen(false)} />
          </div>
          <div className="flex flex-col gap-2 pb-4">
            <button className="btn" onClick={() => getCreditSessionUrl(10, pathname)}>
              Buy 100 Credits ($10)
            </button>
            <button
              onClick={() => {
                setIsCreditsModalOpen(true);
                setIsDrawerOpen(false);
              }}
              style={{ top: 1 }}
              className={`w-full relative flex justify-center items-center gap-2 ${
                (credits?.amount ?? 0) <= 0 ? "btn-ghost-red" : "btn-ghost"
              }`}
            >
              You have {credits?.amount ?? 0}
              <Image src="/tetractys.png" alt="Buy credits" priority width={15} height={15} className="invert" />{" "}
              Credits
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
