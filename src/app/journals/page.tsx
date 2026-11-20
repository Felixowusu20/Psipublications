import Link from "next/link";
import { prisma } from "@/lib/db";
import { journalCardColor } from "@/lib/journal-colors";
import {
  rebrandLegacyPublisherContentOnce,
  scrubLegacyPublisherText,
} from "@/lib/legacy-brand";

export const dynamic = "force-dynamic";

export default async function JournalsPage() {
  let journals: Awaited<ReturnType<typeof prisma.journal.findMany>> = [];
  try {
    await rebrandLegacyPublisherContentOnce();
    journals = await prisma.journal.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
  } catch {
    journals = [];
  }

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f7f1f3_0%,#ffffff_28%,#ffffff_100%)]">
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% -10%, rgba(110,31,58,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 0%, rgba(11,58,83,0.10), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            PSI Publications
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[2.1rem] leading-[1.1] text-[var(--ink)] sm:text-[2.75rem]">
            Journals
          </h1>
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-[var(--muted)]">
            Eight peer-reviewed titles across science, health, society, and
            interdisciplinary inquiry. Open a journal for scope, issues, and
            submission details.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-12">
        {journals.length === 0 ? (
          <p className="border border-[var(--line)] bg-white px-6 py-10 text-center text-base text-[var(--muted)]">
            No journals yet. A super admin can add them under Admin → Journals.
          </p>
        ) : (
          <ul className="space-y-3">
            {journals.map((journal, index) => {
              const color = journalCardColor(journal.coverColor, index);
              const title = scrubLegacyPublisherText(journal.title);
              const description = scrubLegacyPublisherText(journal.description);
              return (
                <li key={journal.id}>
                  <Link
                    href={`/journals/${journal.slug}`}
                    className="group flex overflow-hidden border border-[var(--line)] bg-white transition hover:border-[var(--accent)]/35 hover:shadow-[0_10px_28px_rgba(26,15,20,0.06)]"
                  >
                    <span
                      className="w-1.5 shrink-0 sm:w-2"
                      style={{ background: color }}
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5 sm:py-5">
                      <div className="flex shrink-0 items-center gap-3 sm:w-[5.5rem] sm:flex-col sm:items-start sm:gap-1">
                        <span
                          className="inline-flex min-w-[3.25rem] items-center justify-center rounded-sm px-2 py-1 text-[11px] font-bold tracking-[0.08em] text-white"
                          style={{ background: color }}
                        >
                          {journal.shortTitle}
                        </span>
                        {journal.openAccess ? (
                          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                            Open access
                          </span>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-[family-name:var(--font-display)] text-[1.15rem] font-bold leading-snug text-[var(--ink)] transition group-hover:text-[var(--accent)] sm:text-[1.25rem]">
                          {title}
                        </h2>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
                          {description}
                        </p>
                        {journal.subjects.length > 0 ? (
                          <p className="mt-2 text-[11px] text-[var(--muted)]">
                            {journal.subjects.slice(0, 4).join(" · ")}
                          </p>
                        ) : null}
                      </div>
                      <span className="hidden shrink-0 text-sm font-semibold text-[var(--accent)] sm:inline">
                        View →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
