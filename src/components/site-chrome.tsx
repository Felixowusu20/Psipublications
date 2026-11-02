"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useAuth } from "@/components/auth-provider";
import { AuthorNotifications } from "@/components/author-notifications";
import { BrandLogo } from "@/components/brand-logo";
import { NavbarSearch } from "@/components/navbar-search";
import { initials } from "@/lib/auth";

type NavChild = { label: string; href: string; hint?: string };

type NavItem = {
  label: string;
  href: string;
  children: NavChild[];
};

type NavJournal = { slug: string; title: string };

function useNavItems(journals: NavJournal[]): NavItem[] {
  return useMemo(
    () => [
      {
        label: "Explore content",
        href: "/articles",
        children: [
          { label: "Latest articles", href: "/articles" },
          { label: "Current issues", href: "/articles/current-issues" },
          { label: "Past issues", href: "/articles/past-issues" },
          { label: "Search articles", href: "/search" },
          { label: "Open access", href: "/articles?access=oa" },
        ],
      },
      {
        label: "Journals",
        href: "/journals",
        children: [
          { label: "View all journals", href: "/journals" },
          ...journals.map((j) => ({
            label: j.title,
            href: `/journals/${j.slug}`,
          })),
        ],
      },
      {
        label: "About the journals",
        href: "/about",
        children: [
          { label: "About PSI", href: "/about" },
          { label: "Help centre & FAQ", href: "/help" },
          { label: "Contact support", href: "/help#contact" },
          { label: "Terms & Conditions", href: "/terms" },
          { label: "Privacy Policy", href: "/privacy" },
        ],
      },
      {
        label: "Publish with us",
        href: "/authors/guidelines",
        children: [
          { label: "Submit a manuscript", href: "/submissions/new" },
          { label: "Author dashboard", href: "/dashboard" },
          { label: "Author guidelines", href: "/authors/guidelines" },
          { label: "Article types", href: "/authors/article-types" },
          { label: "Fees & waivers", href: "/authors/fees" },
        ],
      },
    ],
    [journals],
  );
}

export function SiteHeader() {
  const [navJournals, setNavJournals] = useState<NavJournal[]>([]);
  const nav = useNavItems(navJournals);
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    hydrated.current = true;
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/cms/journals");
        const data = await res.json();
        if (cancelled || !res.ok) return;
        const list = ((data.journals ?? []) as NavJournal[])
          .map((j) => ({ slug: j.slug, title: j.title }))
          .slice(0, 12);
        setNavJournals(list);
      } catch {
        if (!cancelled) setNavJournals([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setOpen(null);
    setAccountOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setOpen(null);
      }
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (pathname.startsWith("/admin")) return null;
  if (pathname.startsWith("/pay")) return null;
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  function handleSignOut() {
    void logout().then(() => {
      setAccountOpen(false);
      setMobileOpen(false);
      setOpen(null);
      router.replace("/login");
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white">
      {/* Utility row — Nature style */}
      <div className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <p className="hidden text-xs text-[var(--muted)] sm:block">
            Peer-reviewed journals · Open scholarship
          </p>
          <div className="ml-auto flex items-center gap-4 text-sm text-[var(--ink)]">
            <Link href="/journals" className="hidden hover:underline sm:inline">
              View all journals
            </Link>
            <button
              type="button"
              className="hover:underline"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
            >
              Search
            </button>
            {ready && user ? (
              <>
                <AuthorNotifications />
                <div className="relative" ref={accountRef}>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[10px] font-bold text-[var(--accent)]">
                      {initials(user.name)}
                    </span>
                    <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-56 border border-[var(--line)] bg-white p-1 shadow-md">
                      <Link href="/dashboard" className="menu-link">
                        My dashboard
                      </Link>
                      <Link href="/profile" className="menu-link">
                        My profile
                      </Link>
                      <Link href="/notifications" className="menu-link">
                        Notifications
                      </Link>
                      <button
                        type="button"
                        className="menu-link w-full text-left text-rose-700"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login" className="font-semibold hover:underline">
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-b border-[var(--line)] bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6">
            <Suspense fallback={<div className="h-9 bg-[var(--surface)]" />}>
              <NavbarSearch variant="bar" />
            </Suspense>
          </div>
        </div>
      )}

      {/* Brand + primary nav */}
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <BrandLogo variant="full" priority />

        <div className="flex items-center gap-2">
          {!ready ? null : !user ? (
            <Link
              href="/register"
              className="hidden text-sm font-bold text-[var(--accent)] hover:underline lg:inline"
            >
              Register
            </Link>
          ) : null}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-[var(--line)] text-[var(--ink)] lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <nav
        ref={navRef}
        className="hidden border-t border-[var(--line)] lg:block"
      >
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center">
            {nav.map((item) => {
              const isOpen = open === item.label;
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                item.children.some((c) => {
                  const base = c.href.split("?")[0];
                  return pathname === base || pathname.startsWith(`${base}/`);
                });

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (hydrated.current) setOpen(item.label);
                  }}
                  onMouseLeave={() => setOpen(null)}
                >
                  <div
                    className={`flex items-center ${
                      isOpen
                        ? "bg-[#dceaf2] text-[var(--ink)]"
                        : active
                          ? "border-b-2 border-[var(--accent)]"
                          : "border-b-2 border-transparent"
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="px-3 py-3 text-[0.92rem] font-bold"
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="pr-3 pl-0 py-3"
                      aria-label={`${item.label} menu`}
                      aria-expanded={isOpen}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!hydrated.current) return;
                        setOpen((prev) =>
                          prev === item.label ? null : item.label,
                        );
                      }}
                    >
                      <Chevron open={isOpen} />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="absolute left-0 top-full z-50 pt-0">
                      {/* Nature-style dropdown: black panel, white underlined links */}
                      <div className="min-w-[20rem] max-w-[28rem] bg-black px-5 py-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.href + child.label}
                            href={child.href}
                            className="block py-2 text-[0.95rem] font-bold leading-snug text-white underline decoration-1 underline-offset-[0.2em] transition hover:text-[#e8a0b2]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              href="/submissions/new"
              className="ml-1 px-3 py-3 text-sm font-bold text-[var(--accent)] hover:underline"
            >
              Submit
            </Link>
          </div>
          <Link
            href="/authors/guidelines"
            className="hidden text-sm text-[var(--muted)] hover:text-[var(--ink)] hover:underline xl:inline"
          >
            Guide to authors
          </Link>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[var(--ink)]/45"
            onClick={() => setMobileOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex h-dvh w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--line)] px-4">
              <BrandLogo variant="full" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center border border-[var(--line)] text-[var(--ink)]"
              >
                <HamburgerIcon open />
              </button>
            </div>

            <div className="border-b border-[var(--line)] px-3 py-3">
              <Suspense fallback={<div className="h-9 bg-[var(--surface)]" />}>
                <NavbarSearch variant="bar" />
              </Suspense>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              <nav className="space-y-1">
                {nav.map((item) => {
                  const sectionOpen = mobileSection === item.label;
                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left ${
                          sectionOpen ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--surface)]"
                        }`}
                        aria-expanded={sectionOpen}
                        onClick={() =>
                          setMobileSection((prev) =>
                            prev === item.label ? null : item.label,
                          )
                        }
                      >
                        <span
                          className={`text-[15px] font-bold ${
                            sectionOpen ? "text-[var(--accent)]" : "text-[var(--ink)]"
                          }`}
                        >
                          {item.label}
                        </span>
                        <Chevron open={sectionOpen} />
                      </button>

                      {sectionOpen && (
                        <div className="mt-1 ml-3 space-y-0.5 border-l border-[var(--line)] pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className="block px-3 py-2.5 text-sm text-[var(--ink)] hover:bg-[var(--surface)]"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="shrink-0 border-t border-[var(--line)] bg-white p-4">
              {user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    className="bg-[var(--surface)] px-3 py-2.5 text-center text-sm font-bold text-[var(--ink)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    className="bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-700"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    className="border border-[var(--line)] px-3 py-3 text-center text-sm font-bold text-[var(--ink)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="bg-[var(--accent)] px-3 py-3 text-center text-sm font-bold text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-4" aria-hidden>
      <span
        className={`absolute left-0 block h-0.5 w-4 bg-current transition duration-200 ${
          open ? "top-1.5 rotate-45" : "top-0"
        }`}
      />
      <span
        className={`absolute left-0 top-1.5 block h-0.5 w-4 bg-current transition duration-200 ${
          open ? "scale-x-0 opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 block h-0.5 w-4 bg-current transition duration-200 ${
          open ? "top-1.5 -rotate-45" : "top-3"
        }`}
      />
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  if (pathname.startsWith("/pay")) return null;
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  return (
    <footer className="mt-auto max-w-[100%] overflow-x-clip border-t border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 sm:py-12 lg:grid-cols-4">
        <div>
          <BrandLogo href="/" variant="full" className="h-10 sm:h-11" />
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            A research publishing house for peer-reviewed open scholarship
            across the sciences.
          </p>
        </div>
        <FooterCol
          title="Publish"
          links={[
            ["/journals", "Journals"],
            ["/submissions/new", "Submit manuscript"],
            ["/authors/guidelines", "Author guidelines"],
            ["/authors/fees", "Fees & waivers"],
          ]}
        />
        <FooterCol
          title="Discover"
          links={[
            ["/articles", "Articles"],
            ["/articles/current-issues", "Current issues"],
            ["/articles/past-issues", "Past issues"],
            ["/search", "Search"],
            ["/authors/article-types", "Article types"],
            ["/about", "About"],
          ]}
        />
        <FooterCol
          title="Trust & support"
          links={[
            ["/help", "Help & FAQ"],
            ["/terms", "Terms & Conditions"],
            ["/privacy", "Privacy Policy"],
            ["/login", "Log in"],
          ]}
        />
      </div>
      <div className="border-t border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-4 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 PSI Publications.</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/terms" className="hover:text-[var(--ink)] hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[var(--ink)] hover:underline">
              Privacy
            </Link>
            <Link href="/help" className="hover:text-[var(--ink)] hover:underline">
              FAQ
            </Link>
            <Link href="/about" className="hover:text-[var(--ink)] hover:underline">
              About
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <p className="text-sm font-bold text-[var(--ink)]">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-[var(--muted)] hover:text-[var(--ink)] hover:underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
