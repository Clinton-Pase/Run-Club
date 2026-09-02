"use client";

import Image from "next/image";
import { useState } from "react";
import about1 from "./assets/Events/Beachrun/about1.jpg";
import about2 from "./assets/Events/Runday/about2.jpeg";

const events = [
  {
    title: "5KM Beach Run & Bond",
    date: "September 2026",
    cover: about1,
    images: [
      about1,
    ],
  },
  {
    title: "ALX Community Run",
    date: "August 2026",
    cover:about2,
    images: [
      about2,
    ],
  },
  {
    title: "Weekend Run",
    date: "July 2026",
    cover: about2,
    images: [
      about1,
    ],
  },
];

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<
    (typeof events)[number] | null
  >(null);

  return (
    <section id="events" className="bg-gray-50 px-6 py-20 md:py-12">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 max-w-2xl">
          <p className="mb3 text-[1.3rem] font-semibold uppercase tracking-[0.35em] text-emerald-500">
            Events
          </p>

          <h2 className="text-4xl font-extrabold uppercase leading-none tracking-tight text-gray-900 md:text-6xl">
            Miles We&apos;ve
            <br />
            Shared.
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-600 md:text-lg">
            From casual community runs to memorable race days, here&apos;s a
            look at some of the moments we&apos;ve shared together.
          </p>
        </div>

        {/* Past Events */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <button
              key={event.title}
              type="button"
              onClick={() => setSelectedEvent(event)}
              className="group text-left"
            >
              <div className="relative h-95 overflow-hidden rounded-3xl">
                <Image
                  src={event.cover}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                    {event.date}
                  </p>

                  <h3 className="text-2xl font-bold">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-sm text-white/70">
                    View photos →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Upcoming Race Calendar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl bg-gray-950 px-8 py-10 text-center text-white md:flex-row md:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              What&apos;s next?
            </p>

            <h3 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Find your next race.
            </h3>

            <p className="mt-2 max-w-xl text-white/75">
              Explore upcoming races, check event details, and register
              through the ALX Race Calendar.
            </p>
          </div>

          <a
            href="https://alx.ng/calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-emerald-500 transition-transform hover:scale-105"
          >
            Check Out Upcoming Races →
          </a>
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-xl text-white"
              aria-label="Close gallery"
            >
              ×
            </button>

            <div className="mb-6 pr-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                {selectedEvent.date}
              </p>

              <h3 className="mt-1 text-3xl font-extrabold text-gray-900">
                {selectedEvent.title}
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {selectedEvent.images.map((image, index) => (
                <div
                  key={image}
                  className={`relative overflow-hidden rounded-2xl ${
                    index === 0 ? "md:col-span-2 h-112.5" : "h-75"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${selectedEvent.title} photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}