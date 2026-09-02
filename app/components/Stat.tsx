"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 300,
    suffix: "+",
    label: "Active Members",
  },
  {
    value: 10000,
    suffix: "+",
    label: "KM Covered",
  },
  {
    value: 50,
    suffix: "+",
    label: "Runs Completed",
  },
  {
    value: 4.9,
    suffix: "",
    label: "Community Rating",
    decimal: true,
  },
];

export default function Stats() {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.4,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white px-8 pb-20 pt-16 md:pb-16 md:pt-18"
    >
      <div className="mx-auto mt-3 grid max-w-5xl grid-cols-2 font-[700] md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`
              flex flex-col items-center px-6 text-center
              ${index % 2 !== 0 ? "border-l border-gray-700" : ""}
              ${index >= 2 ? "border-t border-gray-700 md:border-t-0" : ""}
              ${index >= 1 ? "md:border-l" : ""}
            `}
          >
            <Stat
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              started={started}
              decimal={stat.decimal}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({
  value,
  suffix,
  label,
  started,
  decimal = false,
}: {
  value: number;
  suffix: string;
  label: string;
  started: boolean;
  decimal?: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;

    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = value * easedProgress;

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [started, value]);

  return (
    <>
      <span className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
        {decimal ? count.toFixed(1) : Math.floor(count)}
        {suffix}
      </span>

      <span className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
        {label}
      </span>
    </>
  );
}