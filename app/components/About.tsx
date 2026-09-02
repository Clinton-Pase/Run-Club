"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import about2 from "./assets/about2.jpeg";
import about1 from "./assets/about1.jpg";
import about3 from "./assets/about3.jpeg";
import Group from "./assets/Group.jpg";

const images = [
  {
    src: about2,
    alt: "ALX Run Club members running together",
  },
  {
    src: about1,
    alt: "ALX Run Club community",
  },
  {
    src: about3,
    alt: "ALX Run Club runners",
  },
  {
    src: Group,
    alt: "ALX Run Club members",
  },
];

export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) =>
        current === images.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const previousImage = () => {
    setCurrentIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <section id="about" className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-20">
        
        {/* Image Carousel */}
        <div className="relative h-[450px] overflow-hidden rounded-3xl md:h-[600px]">
          {images.map((image, index) => (
            <Image
              key={index}
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              className={`object-cover transition-opacity duration-700 ${
                index === currentIndex
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
          ))}

          {/* Previous Button */}
          <button
            type="button"
            onClick={previousImage}
            aria-label="Previous image"
            className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-transform hover:scale-105"
          >
            ←
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-transform hover:scale-105"
          >
            →
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-5 left-5 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-7 bg-white"
                    : "w-2.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-xl">
          <p className="mb-3 text-[1.3rem] font-semibold uppercase tracking-[0.35em] text-emerald-500">
            About Us
          </p>

          <h2 className="text-4xl font-extrabold uppercase leading-[1] tracking-tight text-gray-900 md:text-6xl">
            More Than A Run.
            <br />
            We&apos;re A Community.
          </h2>

          <div className="mt-8 space-y-5 text-base leading-7 text-gray-600 md:text-lg">
            <p>
              ALX Run Club brings together people who believe movement is
              better when shared. Whether you&apos;re an experienced runner or
              taking your first steps, there&apos;s a place for you here.
            </p>

            <p>
              We run to stay active, build meaningful connections, challenge
              ourselves, and grow together — one kilometre at a time,we #DOHARDTHINGS.
            </p>
          </div>

          {/* Values */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold uppercase tracking-wide text-emerald-500">
            <span>Community</span>
            <span>Consistency</span>
            <span>Growth</span>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#join"
              className="inline-flex items-center justify-center rounded-full bg-gray-950 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-emerald-500 hover:scale-[1.02]"
            >
              Join Us
              <span className="ml-3">→</span>
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-gray-900 transition-all hover:border-gray-900 hover:scale-[1.02]"
            >
              Follow Us on Strava
              <span className="ml-3">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}