import { NatureJournalList } from "@/components/nature-journal-list";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function JournalsPage() {
  let journals: Awaited<ReturnType<typeof prisma.journal.findMany>> = [];
  try {
    journals = await prisma.journal.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
  } catch {
    journals = [];
  }

  return (
    <div className="min-h-full">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
          <p className="nature-kicker">PSI Publications</p>
          <h1 className="nature-section-title mt-1.5">Journals</h1>
          <p className="mt-2.5 max-w-2xl text-[0.95rem] leading-relaxed text-[var(--ink)]">
            Browse our peer-reviewed titles, then open a journal to view scope,
            issues, and submission details.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
        {journals.length === 0 ? (
          <p className="border border-[var(--line)] bg-white p-8 text-center text-base text-[var(--muted)]">
            No journals yet. A super admin can add them under Admin → Journals.
          </p>
        ) : (
          <NatureJournalList
            variant="page"
            journals={journals.map((j) => ({
              slug: j.slug,
              title: j.title,
              shortTitle: j.shortTitle,
              openAccess: j.openAccess,
            }))}
          />
        )}
      </div>
    </div>
  );
}
