import Image from "next/image";
import Link from "next/link";
import { authorDisplayName } from "@/lib/orcid";

type Props = {
  href: string;
  title: string;
  summary: string;
  imageUrl?: string | null;
  authors?: string[];
  category?: string;
  date?: string;
  /** Optional fallback gradient when no image */
  fallbackTone?: string;
};

/**
 * Nature homepage card:
 * image → underlined serif title → sans summary → authors | category | date
 */
export function NatureArticleCard({
  href,
  title,
  summary,
  imageUrl,
  authors = [],
  category,
  date,
  fallbackTone = "linear-gradient(135deg, #6e1f3a 0%, #1a0f14 55%, #3a1524 100%)",
}: Props) {
  const authorLabel =
    authors.length > 0
      ? authors.slice(0, 2).map(authorDisplayName).join(" & ") +
        (authors.length > 2 ? " et al." : "")
      : null;

  const metaParts = [authorLabel, category, date].filter(Boolean);

  return (
    <article className="flex h-full flex-col">
      <Link href={href} className="group flex h-full flex-col">
        <div className="relative aspect-[1.84/1] w-full overflow-hidden bg-[var(--surface)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0" style={{ background: fallbackTone }} />
          )}
        </div>

        <h3 className="mt-3 font-[family-name:var(--font-display)] text-[1.125rem] font-bold leading-[1.3] text-[var(--ink)] sm:text-[1.2rem]">
          <span className="underline decoration-1 underline-offset-[0.16em] group-hover:text-[var(--accent)]">
            {title}
          </span>
        </h3>

        {summary ? (
          <p className="mt-2 text-[0.9rem] leading-[1.45] text-[var(--ink)]">
            {summary}
          </p>
        ) : null}

        {metaParts.length > 0 ? (
          <p className="mt-auto pt-3 text-[0.8125rem] leading-snug text-[var(--ink)]">
            {metaParts.map((part, i) => (
              <span key={`${part}-${i}`}>
                {i > 0 ? (
                  <span className="mx-1.5 text-[var(--muted)]" aria-hidden>
                    |
                  </span>
                ) : null}
                <span className={i === 0 && authorLabel ? "font-bold" : undefined}>
                  {part}
                </span>
              </span>
            ))}
          </p>
        ) : null}
      </Link>
    </article>
  );
}
