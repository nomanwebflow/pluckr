import { Logo } from "@/components/logo";

// Guides has one page so far. It lives on the legacy site until it moves here.
type NavLink = { label: string; href: string; hideBelow?: boolean };

const links: NavLink[] = [
  { label: "Home", href: "/", hideBelow: true },
  { label: "Price", href: "/#price" },
  { label: "Features", href: "/#features" },
  { label: "Guides", href: "/guides/download-all-images-from-google-docs" },
];

// One bar for the top nav and the footer. The footer flips the gradient so
// its top edge meets the closing CTA above it.
function Bar({
  as: Tag,
  links,
  label,
  flip = false,
}: {
  as: "header" | "footer";
  links: NavLink[];
  label: string;
  flip?: boolean;
}) {
  return (
    <Tag className="relative flex items-center justify-between px-6 py-4 text-white md:px-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 from-[#0d0d0d] to-black ${flip ? "bg-gradient-to-b" : "bg-gradient-to-t"}`}
        />
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

      <nav aria-label={label} className="relative">
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
    </Tag>
  );
}

export function Nav() {
  return <Bar as="header" links={links} label="Main" />;
}

const footerLinks: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return <Bar as="footer" links={footerLinks} label="Footer" flip />;
}
