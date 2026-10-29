
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ChallengeNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative flex items-center justify-between gap-4">
      <Link 
        href="/challenges"
        className="text-sm font-semibold text-gray-50 hover:underline"
        onClick={closeMenu}
      >
        ← Back
      </Link>

      {/* DESKTOP NAV */}
      <nav className="hidden items-center gap-6 text-sm md:flex">
        <Link href="/dashboard" className="text-zinc-300 hover:text-green-400">
          Dashboard
        </Link>
           <Link href="/profile" className="text-zinc-300 hover:text-green-400">
        Profile
        </Link>
        <Link href="/challenges" className="text-zinc-300 hover:text-green-400">
          Challenges
        </Link>
        <Link href="/progress" className="text-zinc-300 hover:text-green-400">
          My Progress
        </Link> 
         <Link href="/leaderboard" className="text-zinc-300 hover:text-green-400">
          Leaderboard
        </Link>
        <Link href="/achievements" className="text-zinc-300 hover:text-green-400">
          Achievements
        </Link>
        <Link   href="https://alx.ng/calendar" className="text-zinc-300 hover:text-green-400">
          Events
        </Link>
      </nav>

      {/* MOBILE MENU BUTTON */}
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-red-800 hover:text-white md:hidden"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      {/* MOBILE NAV */}
      {menuOpen && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#031429] shadow-2xl md:hidden">
          <nav className="flex flex-col p-2">
            {[
                { href: "/dashboard", label: "Dashboard" },
                 { href: "/profile", label: "Profile" },
              { href: "/challenges", label: "Challenges" },
              { href: "/progress", label: "My Progress" },
              { href: "/leaderboard", label: "Leaderboard" },
              { href: "/achievements", label: "Achievements" },
              { href: "https://alx.ng/calendar", label: "Events" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-green-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
