"use client";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./theme-toggler";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 py-2 flex gap-2 md:gap-3">
                <Image
                  className="h-6 w-auto"
                  src="/house2.png"
                  alt="Confy Logo"
                  height={25}
                  width={25}
                />
                <h2>
                  Census Surveyor<span className="hidden sm:inline"> - For Your Houshold</span>
                </h2>
              </div>
            </Link>
          </div>
          <div
            className="flex items-center justify-center gap-3 flex-shrink-0"
            id="clerk-user-container"
          >
            <span className="cursor-pointer flex items-center">
            </span>
            <span className="cursor-pointer mx-1">
              <ModeToggle />
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
