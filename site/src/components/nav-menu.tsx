"use client";

import { useEffect, useState } from "react";

type Item = { label: string; href: string };

// Mobile-only menu: a two-bar toggle that opens a full-width panel under the
// header. The desktop links stay inline in nav.tsx.
export function NavMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 items-center justify-center"
      >
        <span className="relative block h-3 w-6">
          <span
            className={`absolute left-0 h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`}
          />
        </span>
      </button>

      {open && (
        <ul
          id="mobile-menu"
          className="fixed inset-x-0 top-[68px] z-50 flex flex-col bg-[#0d0d0d] px-6 pb-8 pt-4"
        >
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display block py-3 text-3xl text-white transition-colors hover:text-white/60"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
