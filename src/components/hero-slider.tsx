"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const RESEARCH_FIELDS = [
  "Chemistry",
  "Biology",
  "Physics",
  "Medicine",
  "Mathematics",
  "Environmental Science",
  "Materials Science",
  "Computer Science",
] as const;

const HERO_SLIDES = [
  {
    src: "/hero/slide-1.jpg",
    alt: "Scientific research across chemistry, biology, physics, and related fields",
  },
  {
    src: "/hero/slide-2.jpg",
    alt: "Researchers collaborating in the laboratory",
  },
  {
    src: "/hero/slide-3.jpg",
    alt: "Open scholarship and peer-reviewed discovery",
  },
  {
    src: "/hero/slide-4.jpg",
    alt: "Global research and scientific publishing",
  },
] as const;

const SLIDE_MS = 5500;

/**
 * Nature-style split hero: static editorial panel + automatic image slide
 * (no arrows, dots, or controls — same layout as the static image).
 */
export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className="nature-section-rule relative isolate max-w-[100%] overflow-x-clip bg-[var(--hero-panel)] text-white home-reveal"
      aria-label="Featured research"
    >
      <div className="mx-auto grid max-w-[1200px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative z-10 flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:min-h-[30rem] lg:px-10 lg:py-20">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#e8a0b2]">
            Research publishing
          </p>
          <h1 className="nature-title-light mt-3 max-w-xl text-[1.55rem] sm:text-[1.85rem] lg:text-[2.05rem]">
            Peer-reviewed science across chemistry, biology, physics and related
            fields
          </h1>
          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-white/80 sm:text-base">
            PSI Publications advances open scholarship — from manuscript
            submission and peer review to citable, discoverable articles.
          </p>

          <ul
            className="mt-6 flex max-w-xl flex-wrap gap-x-3.5 gap-y-1.5 border-t border-white/20 pt-4"
            aria-label="Research fields we publish"
          >
            {RESEARCH_FIELDS.map((field) => (
              <li
                key={field}
                className="text-[0.82rem] font-semibold text-white/88"
              >
                {field}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link
              href="/submissions/new"
              className="inline-flex rounded-sm bg-white px-5 py-2.5 text-[0.9rem] font-bold text-[var(--ink)] transition hover:bg-[var(--accent-soft)]"
            >
              Submit a manuscript
            </Link>
            <Link
              href="/journals"
              className="inline-flex rounded-sm border border-white/40 px-5 py-2.5 text-[0.9rem] font-bold text-white transition hover:bg-white/10"
            >
              Browse journals
            </Link>
          </div>
        </div>

        <div
          className="relative min-h-[14rem] overflow-hidden sm:min-h-[20rem] lg:min-h-full"
          aria-live="polite"
          aria-atomic="true"
        >
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== index}
            >
              <Image
                src={slide.src}
                alt={i === index ? slide.alt : ""}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
