import Link from "next/link";

export type NatureJournalItem = {
  slug: string;
  title: string;
  shortTitle?: string | null;
  openAccess?: boolean;
};

type Props = {
  journals: NatureJournalItem[];
  /** Full page list vs compact homepage / dropdown panel */
  variant?: "page" | "panel" | "inline";
  className?: string;
};

/**
 * Nature-style journal menu: solid black panel, bold white underlined links.
 * Clean professional list — not cards.
 */
export function NatureJournalList({
  journals,
  variant = "page",
  className = "",
}: Props) {
  if (journals.length === 0) {
    return (
      <p className="bg-black px-6 py-5 text-base text-white/70">
        No journals yet.
      </p>
    );
  }

  if (variant === "inline") {
    return (
      <nav className={className} aria-label="Journals">
        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {journals.map((journal) => (
            <li key={journal.slug}>
              <Link
                href={`/journals/${journal.slug}`}
                className="flex items-baseline justify-between gap-4 py-3 transition hover:bg-[var(--surface)]"
              >
                <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-bold leading-snug text-[var(--ink)] underline decoration-1 underline-offset-[0.16em]">
                  {journal.title}
                </span>
                {journal.shortTitle ? (
                  <span className="shrink-0 text-xs font-semibold text-[var(--muted)]">
                    {journal.shortTitle}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  const pad =
    variant === "panel" ? "px-5 py-4" : "px-6 py-6 sm:px-8 sm:py-7";

  return (
    <nav className={`bg-black text-white ${pad} ${className}`} aria-label="Journals">
      <ul
        className={
          variant === "page"
            ? "grid gap-x-10 gap-y-0.5 sm:grid-cols-2"
            : "flex flex-col"
        }
      >
        {journals.map((journal) => (
          <li key={journal.slug} className="border-b border-white/10 last:border-b-0 sm:border-b-0">
            <Link
              href={`/journals/${journal.slug}`}
              className="group flex flex-col py-2.5 sm:py-3"
            >
              <span className="text-[1.02rem] font-bold leading-snug text-white underline decoration-1 underline-offset-[0.18em] transition group-hover:text-[#e8a0b2] sm:text-[1.08rem]">
                {journal.title}
              </span>
              {variant === "page" && (journal.shortTitle || journal.openAccess) ? (
                <span className="mt-1 text-[0.78rem] text-white/55">
                  {[
                    journal.shortTitle,
                    journal.openAccess ? "Open access" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
