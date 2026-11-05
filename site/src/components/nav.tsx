import { Logo } from "@/components/logo";

// Guides has one page so far. It lives on the legacy site until it moves here.
const links = [
  { label: "Home", href: "/", hideBelow: true },
  { label: "Price", href: "/#price" },
  { label: "Features", href: "/#features" },
  { label: "Guides", href: "/guides/download-all-images-from-google-docs" },
];

export function Nav() {
  return (
    <header className="relative flex items-center justify-between px-6 py-4 text-white md:px-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-black" />
        <div
          className="absolute inset-0 bg-top-left opacity-40"
          style={{
            backgroundImage: 'url("/assets/hero-noise.png")',
            backgroundSize: "220px 220px",
          }}
        />
      </div>

      <div className="relative">
        <Logo size="sm" />
      </div>

      <nav aria-label="Main" className="relative">
        <ul className="flex items-start gap-5 text-sm leading-normal sm:gap-10 sm:text-base">
          {links.map((link) => (
            <li
              key={link.label}
              className={
                link.hideBelow ? "hidden min-[380px]:block" : undefined
              }
            >
              <a
                href={link.href}
                className="transition-colors hover:text-white/60 focus-visible:text-white/60"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
