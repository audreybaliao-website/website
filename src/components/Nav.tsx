"use client";

import { useEffect, useState } from "react";

type NavItem = {
  numeral: string;
  label: string;
  id: string;
};

const ITEMS: readonly NavItem[] = [
  { numeral: "I", label: "Hello", id: "about" },
  { numeral: "II", label: "Work", id: "stories" },
  { numeral: "III", label: "Rates", id: "rates" },
  { numeral: "IV", label: "Connect", id: "connect" },
] as const;

export default function Nav() {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const sections = ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that's currently intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        // Mid-viewport band: section becomes "active" once its top crosses
        // 25% from the top.
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-emerald-950/15 bg-ivory/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4 lg:px-10 lg:py-5">
        <a
          href="#about"
          className="flex items-baseline gap-2 text-emerald-950 transition hover:opacity-80"
          aria-label="Audrey Baliao, back to top"
        >
          <span className="font-serif text-base font-bold tracking-tight">
            Audrey
          </span>
          <span className="font-script text-3xl leading-none text-gold-500">
            Dhey
          </span>
        </a>

        <span
          aria-hidden="true"
          className="hidden h-px flex-1 bg-emerald-950/15 md:block"
        />

        <nav aria-label="Primary">
          <ul className="flex items-baseline gap-x-5 lg:gap-x-7">
            {ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`group flex items-baseline gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                      isActive
                        ? "text-emerald-950"
                        : "text-emerald-950/55 hover:text-emerald-950"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      aria-hidden="true"
                      className={`font-display text-base italic leading-none transition ${
                        isActive ? "text-gold-500" : "text-emerald-950/30"
                      }`}
                    >
                      {item.numeral}
                    </span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
