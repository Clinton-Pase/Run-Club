import Image from "next/image";
import HeroImage from "./assets/about2.jpeg";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0b2a53] md:max-h-[110vh]"
    >
      <div className="grid min-h-screen w-full grid-cols-1 items-center md:grid-cols-2">

        {/* Text */}
        <div className="relative z-20 px-6 py-32 text-white md:px-12 lg:px-20">
          <p className="hero-popup mb-4 text-sm font-semibold uppercase tracking-[0.3em]">
            ALX Run Club
          </p>

          <h1 className="hero-popup-delay-1 max-w-2xl text-[3.8rem] font-[700] uppercase leading-[0.9] tracking-tight md:text-8xl">
            Run.
            <br />
            Connect.
            <br />
            Do Hard things
          </h1>

          <p className="hero-popup-delay-2 mt-6 max-w-lg text-[1.25rem] leading-relaxed text-emerald-500 md:text-[1.4rem]">
            More than running. A community of people pushing forward,
            one kilometre at a time.
          </p>
        </div>

        {/* Image */}
        <div className="relative h-[55vh] min-h-[400px] w-full md:h-screen">
          <Image
            src={HeroImage}
            alt="ALX Run Club runner"
            fill
            priority
            className="object-cover object-center opacity-80"
          />

          {/* Desktop gradient */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#061a34] via-[#061a34]/10 to-transparent md:block" />

          {/* Mobile gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061a34] via-[#061a34]/40 to-transparent md:hidden" />

          {/* Overall blue tint */}
          <div className="absolute inset-0 bg-blue-600/10" />
        </div>
      </div>
    </section>
  );
}