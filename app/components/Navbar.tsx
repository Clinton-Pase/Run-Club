"use client";

import Image from "next/image";
import { useState } from "react";
import Alx from "./assets/alxlogo.png";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
<nav className="fixed left-0 top-0 z-50 w-full bg-white px-5 py-4 shadow-sm">
      <div className="mx-auto flex w-full items-center justify-between">

        {/* Logo */}
        <a href="#home" onClick={() => setIsOpen(false)}>
          <Image
            src={Alx}
            alt="ALX Run Club"
            className="h-10 w-auto"
            priority
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-950 transition-opacity hover:opacity-60"
            >
              {link.name}
            </a>
          ))}

          <a
            href="#join"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Join Us
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-\ bg-white text-gray-900 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <span className="text-2xl leading-none">×</span>
          ) : (
            <span className="text-xl leading-none">☰</span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-5 right-5 top-27 rounded-2xl bg-white p-5 shadow-xl md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
              >
                {link.name}
              </a>
            ))}

            <a
              href="#join"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-xl bg-black px-4 py-3 text-center text-sm font-bold text-white"
            >
              Join Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}