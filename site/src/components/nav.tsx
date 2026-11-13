import { Logo } from "@/components/logo";
import { AskAi } from "@/components/ask-ai";
import { NavMenu } from "@/components/nav-menu";
import { articles, sectionOf } from "@/content/articles";

type NavLink = { label: string; href: string };

const links: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Price", href: "/#price" },
  { label: "Features", href: "/#features" },
  { label: "Guides", href: "/guides" },
];

// One bar for the top nav and the footer. The footer flips the gradient so
// its top edge meets the closing CTA above it.
function Bar({
  as: Tag,
  links,
  label,
  flip = false,
  menu = false,
  before,
}: {
  as: "header" | "footer";
  links: NavLink[];
  label: string;
  flip?: boolean;
  menu?: boolean;
  // Content that sits above the bar, inside the same background.
  before?: React.ReactNode;
}) {
  return (
    <Tag className="relative z-40 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 from-[#0d0d0d] to-black ${flip ? "bg-gradient-to-b" : "bg-gradient-to-t"}`}
        />
        <div
          className="absolute inset-0 bg-top-left opacity-40"
          style={{
            backgroundImage: 'url("/assets/hero-noise.webp")',
            backgroundSize: "220px 220px",
          }}
        />
      </div>

      {before && <div className="relative">{before}</div>}

      <div className="relative flex items-center justify-between px-6 py-4 md:px-16">
      <div className="relative">
        <Logo size="sm" />
      </div>

      {menu && <NavMenu items={links} />}

      <nav aria-label={label} className={`relative ${menu ? "hidden sm:block" : ""}`}>
        <ul className="flex flex-wrap items-start justify-end gap-x-5 gap-y-2 text-sm leading-normal sm:gap-x-10 sm:text-base">
          {links.map((link) => (
            <li key={link.label}>
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
      </div>
    </Tag>
  );
}

export function Nav() {
  return <Bar as="header" links={links} label="Main" menu />;
}

const footerLinks: NavLink[] = [
  { label: "Guides", href: "/guides" },
  { label: "Compare", href: "/compare" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

// Every guide and comparison, linked from every page, so no page relies on
// the index pages alone to be found.
function ArticleIndex() {
  return (
    <nav aria-label="All guides" className="px-6 pb-10 md:px-16">
      <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-2 text-center text-sm leading-normal text-white/50">
        {articles
          .filter((a) => !a.draft)
          .map((a) => (
            <li key={a.slug}>
              <a
                href={`/${sectionOf(a.kind)}/${a.slug}`}
                className="transition-colors hover:text-white focus-visible:text-white"
              >
                {a.title.replace(/^How to /, "").replace(/^./, (c) => c.toUpperCase())}
              </a>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <Bar
      as="footer"
      links={footerLinks}
      label="Footer"
      flip
      before={
        <>
          <AskAi />
          <ArticleIndex />
        </>
      }
    />
  );
}
