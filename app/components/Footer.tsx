import Image from "next/image";
import Alx from "./assets/alxlogo.png";


export default function Footer() {
  return (
    <section
      id="contact"
      className="bg-blue-700 text-white"
    >
      {/* Contact */}
      <div className="px-6 py-24 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
        

          <h2 className="mt-5 text-5xl font-extrabold uppercase leading-none tracking-tight md:text-7xl">
            Let&apos;s Stay
            <br />
            Connected.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/75 md:text-lg">
            Have a question, want to collaborate, or just want to say hello?
            We&apos;d love to hear from you.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:YOUR_EMAIL"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-emerald-500 transition-transform hover:scale-105"
            >
              Email Us
            </a>

            <a
              href="YOUR_STRAVA_URL"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all hover:bg-white hover:text-emerald-500"
            >
              Strava
            </a>

            <a
              href="YOUR_INSTAGRAM_URL"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all hover:bg-white hover:text-emerald-500"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-gray-950 px-6 py-10">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            {/* Brand */}
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                   {/* Logo */}
                    <a href="#home">
                      <Image
                        src={Alx}
                        alt="ALX RUN CLUB"
                        className="h-10 w-auto"
                      />
                    </a>
                
                ALX RUN CLUB
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Run. Connect. Grow.
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-white/60">
              <a
                href="#home"
                className="transition-colors hover:text-white"
              >
                Home
              </a>

              <a
                href="#about"
                className="transition-colors hover:text-white"
              >
                About
              </a>

              <a
                href="#events"
                className="transition-colors hover:text-white"
              >
                Events
              </a>

              <a
                href="#contact"
                className="transition-colors hover:text-white"
              >
                Contact
              </a>

              <a
                href="#join"
                className="font-bold text-white"
              >
                Join Us
              </a>
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} ALX Run Club. All rights reserved.
            </p>

            <p>
              Run. Connect. Grow.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}