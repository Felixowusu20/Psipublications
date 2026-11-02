import Link from "next/link";
import { NatureArticleCard } from "@/components/nature-article-card";
import {
  DEFAULT_INDEXED_PLATFORMS,
  DEFAULT_INDEXED_SECTION,
} from "@/lib/home-cms-defaults";
import { htmlToPlainText } from "@/lib/import-manuscript";

export type RecentArticleCard = {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  abstract: string;
  articleType: string;
  openAccess: boolean;
  publishedAt: string;
  journalTitle: string;
  journalSlug: string;
  volume?: string;
  issue?: string;
  imageUrl?: string | null;
};

export type RecentIndexedPlatform = {
  id?: string;
  name: string;
  blurb: string;
  href: string;
  logoUrl: string;
};

export type RecentIndexedSection = {
  eyebrow?: string | null;
  title: string;
  body?: string | null;
};

type Props = {
  articles: RecentArticleCard[];
  platforms?: RecentIndexedPlatform[];
  indexedSection?: RecentIndexedSection | null;
};

function typeLabel(articleType: string) {
  return (
    (articleType || "Article").replace(/\s+Article$/i, "").trim() || "Article"
  );
}

function formatNatureDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function IndexedAside({
  platforms,
  section,
}: {
  platforms: RecentIndexedPlatform[];
  section: RecentIndexedSection;
}) {
  return (
    <aside
      className="border-t border-[var(--line)] pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
      aria-label={section.title || "Where PSI publications appear"}
    >
      {section.eyebrow ? <p className="nature-kicker">{section.eyebrow}</p> : null}
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold leading-snug text-[var(--ink)]">
        {section.title}
      </h3>
      {section.body ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {section.body}
        </p>
      ) : null}
      <ul className="mt-4 space-y-3">
        {platforms.slice(0, 5).map((p) => (
          <li key={p.id ?? p.name}>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-3"
            >
              {p.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.logoUrl}
                  alt=""
                  className="mt-0.5 h-7 w-7 object-contain"
                />
              ) : null}
              <span>
                <span className="block text-sm font-bold text-[var(--ink)] underline decoration-1 underline-offset-2 group-hover:text-[var(--accent)]">
                  {p.name}
                </span>
                {p.blurb ? (
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">
                    {p.blurb}
                  </span>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function HomeRecentArticles({
  articles,
  platforms: platformsProp,
  indexedSection,
}: Props) {
  const list = articles.slice(0, 4);
  const platforms =
    platformsProp && platformsProp.length > 0
      ? platformsProp
      : DEFAULT_INDEXED_PLATFORMS.map((p, i) => ({
          id: `default-${i}`,
          name: p.name,
          blurb: p.blurb,
          href: p.href,
          logoUrl: p.logoUrl,
        }));
  const section = indexedSection ?? DEFAULT_INDEXED_SECTION;

  return (
    <section
      className="border-b border-[var(--line)] bg-white"
      aria-label="Latest research"
    >
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
          <h2 className="nature-section-title">Latest research</h2>
          <Link
            href="/articles"
            className="shrink-0 text-base font-bold text-[var(--ink)] underline decoration-1 underline-offset-2 hover:text-[var(--accent)]"
          >
            View all articles
          </Link>
        </div>

        {list.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--muted)]">
            No published articles yet. New research will appear here in this
            Nature-style layout.
          </p>
        ) : (
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((article) => (
              <NatureArticleCard
                key={article.id}
                href={`/articles/${article.slug}`}
                title={article.title}
                summary={
                  htmlToPlainText(article.abstract).trim().slice(0, 180) ||
                  typeLabel(article.articleType)
                }
                imageUrl={article.imageUrl}
                authors={article.authors}
                category={typeLabel(article.articleType)}
                date={formatNatureDate(article.publishedAt)}
              />
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-8 border-t border-[var(--line)] pt-8 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="text-sm leading-relaxed text-[var(--ink)] sm:text-base">
              Peer-reviewed open scholarship from the PSI journal family —
              chemistry, biology, physics, and related research fields.
            </p>
          </div>
          <IndexedAside platforms={platforms} section={section} />
        </div>
      </div>
    </section>
  );
}
