"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleListingCard } from "@/components/article-listing-card";
import { NatureJournalList } from "@/components/nature-journal-list";
import { publishingWorkflow } from "@/data/mock";
import { matchesQuery } from "@/lib/page-search";
import {
  DEFAULT_GOAL_TABS,
  DEFAULT_GOALS_SECTION,
  type GoalTabContent,
  type HomeSectionContent,
} from "@/lib/home-cms-defaults";

export type HomeGoalTabCard = GoalTabContent & { id?: string };

export type HomeGoalsSection = Pick<
  HomeSectionContent,
  "eyebrow" | "title" | "body"
>;

export type HomeArticle = {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  abstract: string;
  articleType: string;
  openAccess: boolean;
  doi: string | null;
  publishedAt: string;
  journalTitle: string;
  journalSlug: string;
  volume?: string;
  issue?: string;
  views: number;
  downloads: number;
  keywords: string[];
  hasPdf: boolean;
};

export type HomeAnnouncement = {
  id: string;
  title: string;
  summary: string;
  href: string | null;
  publishedAt: string;
  imageUrl?: string | null;
};

export type HomeJournal = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  openAccess: boolean;
  doiPrefix: string | null;
  coverImageUrl: string | null;
  coverColor: string;
  description: string;
  subjects: string[];
};

type RemoteArticle = HomeArticle;
type RemoteJournal = {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  subjects: string[];
};

type Props = {
  articles: HomeArticle[];
  announcements: HomeAnnouncement[];
  journals: HomeJournal[];
  initialQuery?: string;
  /** IDs already shown in the top “Just published” strip */
  excludeArticleIds?: string[];
  goalTabs?: HomeGoalTabCard[];
  goalsSection?: HomeGoalsSection | null;
};

function articleHaystack(article: HomeArticle) {
  return [
    article.title,
    article.authors.join(" "),
    article.abstract,
    article.doi,
    article.keywords.join(" "),
    article.journalTitle,
    article.articleType,
  ].join(" ");
}

function announcementHaystack(item: HomeAnnouncement) {
  return `${item.title} ${item.summary}`;
}

function journalHaystack(journal: HomeJournal) {
  return [
    journal.title,
    journal.shortTitle,
    journal.doiPrefix,
    journal.description,
    journal.subjects.join(" "),
    journal.openAccess ? "Open Access" : "Subscription",
  ].join(" ");
}

function workflowHaystack(item: (typeof publishingWorkflow)[number]) {
  return `${item.step} ${item.title} ${item.detail} publishing pathway`;
}

function SearchParamsSync({ onQuery }: { onQuery: (value: string) => void }) {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  useEffect(() => {
    onQuery(q);
  }, [q, onQuery]);
  return null;
}

function HomeCatalogInner({
  articles,
  announcements,
  journals,
  initialQuery = "",
  excludeArticleIds = [],
  goalTabs: goalTabsProp,
  goalsSection,
}: Props) {
  const goalTabs =
    goalTabsProp && goalTabsProp.length > 0
      ? goalTabsProp
      : DEFAULT_GOAL_TABS;
  const goalsHeading = goalsSection ?? DEFAULT_GOALS_SECTION;
  const [q, setQ] = useState(initialQuery);
  const [remoteArticles, setRemoteArticles] = useState<RemoteArticle[]>([]);
  const [remoteJournals, setRemoteJournals] = useState<RemoteJournal[]>([]);

  const needle = q.trim();

  const localArticles = useMemo(
    () =>
      needle
        ? articles.filter((article) =>
            matchesQuery(articleHaystack(article), needle),
          )
        : articles,
    [articles, needle],
  );

  const matchedAnnouncements = useMemo(
    () =>
      needle
        ? announcements.filter((item) =>
            matchesQuery(announcementHaystack(item), needle),
          )
        : announcements,
    [announcements, needle],
  );

  const localJournals = useMemo(
    () =>
      needle
        ? journals.filter((journal) =>
            matchesQuery(journalHaystack(journal), needle),
          )
        : journals,
    [journals, needle],
  );

  const matchedWorkflow = useMemo(
    () =>
      needle
        ? publishingWorkflow.filter((item) =>
            matchesQuery(workflowHaystack(item), needle),
          )
        : publishingWorkflow,
    [needle],
  );

  const ctaMatches =
    !needle ||
    matchesQuery(
      "For authors Ready to submit Create an account choose a journal track manuscript peer review DOI assignment publication Register Start submission Be part of what comes next",
      needle,
    );

  useEffect(() => {
    if (!needle) {
      setRemoteArticles([]);
      setRemoteJournals([]);
      return;
    }

    const handle = window.setTimeout(() => {
      const params = new URLSearchParams({ q: needle, type: "all" });
      void fetch(`/api/search?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setRemoteArticles((data.articles ?? []) as RemoteArticle[]);
          setRemoteJournals((data.journals ?? []) as RemoteJournal[]);
        })
        .catch(() => {
          setRemoteArticles([]);
          setRemoteJournals([]);
        });
    }, 180);

    return () => window.clearTimeout(handle);
  }, [needle]);

  const displayedArticles = (() => {
    const merged = needle
      ? mergeArticles(localArticles, remoteArticles)
      : articles;
    if (needle || excludeArticleIds.length === 0) return merged;
    const skip = new Set(excludeArticleIds);
    return merged.filter((a) => !skip.has(a.id));
  })();

  const displayedJournals = needle
    ? mergeJournals(localJournals, remoteJournals, journals)
    : journals;

  const showWorkflow = !needle || matchedWorkflow.length > 0;
  const showGoals = !needle;

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsSync onQuery={setQ} />
      </Suspense>

      <div id="home-results" className="scroll-mt-28" />

      {/* Nature-style goal cards — same editorial card language as nature.com */}
      {showGoals ? (
        <section
          className="border-b border-[var(--line)] bg-white"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
            <div className="max-w-3xl border-b border-[var(--line)] pb-4">
              <p className="nature-kicker">{goalsHeading.eyebrow}</p>
              <h2 className="nature-section-title mt-1.5">{goalsHeading.title}</h2>
              {goalsHeading.body ? (
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-[var(--ink)]">
                  {goalsHeading.body}
                </p>
              ) : null}
            </div>

            <div className="mt-6 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {goalTabs.map((tab) => {
                const primary = tab.links[0];
                return (
                  <article key={tab.key} className="flex h-full flex-col">
                    <Link
                      href={primary?.href || "/journals"}
                      className="group flex h-full flex-col"
                    >
                      <div className="relative aspect-[1.84/1] w-full overflow-hidden bg-[var(--surface)]">
                        <Image
                          src={tab.imageUrl}
                          alt={tab.imageAlt || tab.label}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 220px"
                          unoptimized
                        />
                      </div>
                      <h3 className="mt-3 font-[family-name:var(--font-display)] text-[1.1rem] font-bold leading-[1.3] text-[var(--ink)]">
                        <span className="underline decoration-1 underline-offset-[0.16em] group-hover:text-[var(--accent)]">
                          {tab.title}
                        </span>
                      </h3>
                      <p className="mt-2 text-[0.9rem] leading-[1.45] text-[var(--ink)]">
                        {tab.body}
                      </p>
                      <p className="mt-auto pt-3 text-[0.8rem] leading-snug text-[var(--ink)]">
                        <span className="font-bold">{tab.label}</span>
                        {tab.story ? (
                          <>
                            <span className="mx-1.5 text-[var(--muted)]" aria-hidden>
                              |
                            </span>
                            <span>{tab.story}</span>
                          </>
                        ) : null}
                      </p>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ACS-style: The latest — news + articles */}
      <section
        className="border-b border-[var(--line)] bg-[var(--surface)]/40"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            data-aos="fade-up"
            data-aos-delay="40"
          >
            <div className="max-w-2xl">
              <p className="nature-kicker">The latest from PSI</p>
              <h2 className="nature-section-title mt-1.5">
                News, issues, and new research
              </h2>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-[var(--ink)]">
                Announcements from the editorial office and the newest open
                articles across our journals.
              </p>
            </div>
            <Link
              href="/articles"
              className="shrink-0 text-sm font-bold text-[var(--accent)] underline decoration-1 underline-offset-2"
            >
              View all articles
            </Link>
          </div>

          {(!needle || matchedAnnouncements.length > 0) && (
            <div className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Announcements
              </h3>
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {matchedAnnouncements.length === 0 ? (
                  <p className="rounded-2xl bg-white px-5 py-6 text-sm text-[var(--muted)] ring-1 ring-[var(--line)]">
                    No announcements yet.
                  </p>
                ) : (
                  matchedAnnouncements.map((item, index) => {
                    const card = (
                      <>
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex aspect-[16/10] items-end bg-gradient-to-br from-[var(--accent)] to-[var(--ink)] p-4">
                            <p className="font-[family-name:var(--font-display)] text-lg text-white">
                              PSI News
                            </p>
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-4">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
                            {item.publishedAt}
                          </p>
                          <p className="mt-1.5 font-[family-name:var(--font-display)] text-base font-semibold leading-snug text-[var(--ink)] group-hover:text-[var(--accent)]">
                            {item.title}
                          </p>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                            {item.summary}
                          </p>
                        </div>
                      </>
                    );
                    const className =
                      "group flex w-[min(78vw,300px)] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[var(--line)] transition hover:-translate-y-0.5 hover:shadow-md";
                    const aos = {
                      "data-aos": "fade-up",
                      "data-aos-delay": String(Math.min(index * 90, 360)),
                      "data-aos-duration": "750",
                    } as const;
                    return item.href ? (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={className}
                        {...aos}
                      >
                        {card}
                      </Link>
                    ) : (
                      <article key={item.id} className={className} {...aos}>
                        {card}
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div className="mt-12">
            <div className="flex items-end justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                More published work
              </h3>
            </div>
            <div className="mt-4 w-full min-w-0 space-y-4">
              {displayedArticles.length === 0 ? (
                <p className="rounded-2xl bg-white p-6 text-base text-[var(--muted)] ring-1 ring-[var(--line)]">
                  {needle
                    ? "No matching articles on this page."
                    : articles.length > 0
                      ? "The newest papers are featured above. Browse the full catalog for more."
                      : "No published articles yet. Publish from the admin console to see them here."}
                  {!needle && articles.length > 0 ? (
                    <>
                      {" "}
                      <Link
                        href="/articles"
                        className="font-semibold text-[var(--accent)] hover:underline"
                      >
                        View all articles →
                      </Link>
                    </>
                  ) : null}
                </p>
              ) : (
                displayedArticles.map((article, index) => (
                  <ArticleListingCard
                    key={article.id || article.slug}
                    compact
                    aosDelay={Math.min(index * 80, 320)}
                    article={{
                      slug: article.slug,
                      title: article.title,
                      authors: article.authors,
                      abstract: article.abstract,
                      articleType: article.articleType,
                      openAccess: article.openAccess,
                      doi: article.doi,
                      publishedAt: article.publishedAt,
                      journalTitle: article.journalTitle,
                      journalSlug: article.journalSlug,
                      volume: article.volume,
                      issue: article.issue,
                      views: article.views,
                      downloads: article.downloads,
                      keywords: article.keywords,
                      hasPdf: article.hasPdf,
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Publishing pathway */}
      {showWorkflow ? (
        <section
          className="border-b border-[var(--line)] bg-[var(--surface)]/50"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
            <div className="max-w-2xl" data-aos="fade-up" data-aos-delay="40">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] sm:text-xs">
                Publishing pathway
              </p>
              <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-2xl leading-tight text-[var(--ink)] sm:mt-2 sm:text-4xl">
                How publishing works on PSI
              </h2>
              <p className="mt-2 text-base leading-relaxed text-[var(--muted)] sm:mt-3 sm:text-lg">
                A clear path from manuscript upload to open publication.
              </p>
            </div>

            <ol className="relative mt-8 grid gap-4 sm:mt-12 lg:grid-cols-5 lg:gap-4">
              <div
                className="pointer-events-none absolute left-[10%] right-[10%] top-6 hidden h-0.5 bg-[var(--accent)]/25 lg:block"
                aria-hidden
              />
              {/* Mobile vertical connector */}
              <div
                className="pointer-events-none absolute bottom-8 left-6 top-8 w-0.5 bg-[var(--accent)]/20 lg:hidden"
                aria-hidden
              />
              {(needle ? matchedWorkflow : publishingWorkflow).map(
                (item, index) => (
                  <li
                    key={item.step}
                    className="relative flex flex-row items-start gap-3 lg:flex-col lg:items-center lg:gap-0"
                    data-aos="fade-up"
                    data-aos-delay={String(80 + index * 100)}
                    data-aos-duration="750"
                    data-aos-anchor-placement="top-bottom"
                  >
                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-white text-sm font-bold text-[var(--accent)] shadow-[0_0_0_4px_var(--surface)] ring-4 ring-[var(--accent-soft)] sm:h-12 sm:w-12 sm:text-base lg:mx-auto lg:shadow-[0_0_0_6px_var(--surface)]">
                      {item.step}
                    </div>
                    <article className="mt-0 flex min-w-0 flex-1 flex-col rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[0_12px_28px_-18px_rgba(11,31,51,0.35)] transition hover:-translate-y-1 hover:border-[var(--accent)]/30 hover:shadow-[0_18px_36px_-16px_rgba(30,104,71,0.35)] sm:p-5 lg:mt-6 lg:text-center">
                      <div
                        className="mb-2.5 h-1 w-8 rounded-full bg-[var(--accent)] sm:mb-3 sm:w-10 lg:mx-auto"
                        aria-hidden
                      />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] sm:text-[11px]">
                        Step {item.step}
                      </p>
                      <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug text-[var(--ink)] sm:mt-1.5 sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)] sm:mt-2.5 sm:text-base">
                        {item.detail}
                      </p>
                    </article>
                  </li>
                ),
              )}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Journals — clean Nature list (no cards) */}
      {(!needle || displayedJournals.length > 0) && (
        <section
          className="border-b border-[var(--line)] bg-white"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12">
            <div className="mb-6 flex flex-col gap-2 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="nature-kicker">Journals</p>
                <h2 className="nature-section-title mt-1.5">
                  Our journal portfolio
                </h2>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--ink)]">
                  Peer-reviewed open-access titles across the PSI family.
                  Choose a journal to view scope, issues, and how to submit.
                </p>
              </div>
              <Link
                href="/journals"
                className="shrink-0 self-start text-sm font-bold text-[var(--ink)] underline decoration-1 underline-offset-2 hover:text-[var(--accent)]"
              >
                View all journals
              </Link>
            </div>

            {displayedJournals.length === 0 ? (
              <p className="bg-black px-6 py-5 text-base text-white/70">
                Add journals in the admin CMS.
              </p>
            ) : (
              <NatureJournalList
                variant="page"
                journals={displayedJournals.map((journal) => ({
                  slug: journal.slug,
                  title: journal.title,
                  shortTitle: journal.shortTitle,
                  openAccess: journal.openAccess,
                }))}
              />
            )}
          </div>
        </section>
      )}

      {/* ACS-style membership CTA */}
      {ctaMatches ? (
        <section
          className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--accent)] text-white"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(11,31,51,0.45), transparent 50%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6 sm:py-16">
            <div className="max-w-xl">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/75">
                For authors
              </p>
              <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-bold leading-tight sm:text-2xl lg:text-[1.85rem]">
                Be part of what comes next in research
              </h2>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-white/88">
                Create an account, choose a journal, and track your manuscript
                from peer review through NID assignment and open publication.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg border border-white/35 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Register
              </Link>
              <Link
                href="/submissions/new"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft)]"
              >
                Start submission
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function mergeArticles(local: HomeArticle[], remote: RemoteArticle[]) {
  const bySlug = new Map<string, HomeArticle>();
  for (const article of [...local, ...remote]) {
    if (!bySlug.has(article.slug)) bySlug.set(article.slug, article);
  }
  return [...bySlug.values()];
}

function mergeJournals(
  local: HomeJournal[],
  remote: RemoteJournal[],
  source: HomeJournal[],
) {
  const bySlug = new Map<string, HomeJournal>();
  for (const journal of local) bySlug.set(journal.slug, journal);
  for (const journal of remote) {
    if (bySlug.has(journal.slug)) continue;
    const existing = source.find((item) => item.slug === journal.slug);
    bySlug.set(
      journal.slug,
      existing ?? {
        id: journal.id,
        slug: journal.slug,
        title: journal.title,
        shortTitle: journal.shortTitle ?? "",
        openAccess: true,
        doiPrefix: null,
        coverImageUrl: null,
        coverColor: "",
        description: "",
        subjects: journal.subjects,
      },
    );
  }
  return [...bySlug.values()];
}

export function HomeCatalog(props: Props) {
  return <HomeCatalogInner {...props} />;
}
