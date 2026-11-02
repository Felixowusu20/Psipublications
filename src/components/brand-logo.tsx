import Link from "next/link";

type Props = {
  /** Pass null to render without a link wrapper. */
  href?: string | null;
  /** Prefer full lockup. Use onDark on dark surfaces (footer, auth). */
  variant?: "full" | "onDark" | "mark";
  className?: string;
  priority?: boolean;
};

/**
 * PSI mark + Nature-style serif wordmark (Harding/Palatino feel via Libre Baskerville).
 */
export function BrandLogo({
  href = "/",
  variant = "full",
  className = "",
  priority = false,
}: Props) {
  const src =
    variant === "onDark"
      ? "/brand/logo-psi-on-dark.png"
      : variant === "mark"
        ? "/favicon.png"
        : "/brand/logo-psi.png";

  const isMark = variant === "mark";
  const onDark = variant === "onDark";

  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={isMark ? 36 : 40}
        height={isMark ? 36 : 48}
        className={
          isMark
            ? "h-8 w-8 object-contain"
            : "h-9 w-auto max-w-[40px] object-contain object-left sm:h-10 sm:max-w-[44px]"
        }
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
      {variant !== "mark" && (
        <span className="leading-none">
          <span
            className={`block font-[family-name:var(--font-display)] text-[1.65rem] font-bold tracking-[-0.03em] sm:text-[1.85rem] ${
              onDark ? "text-white" : "text-[var(--ink)]"
            }`}
          >
            psi
          </span>
          <span
            className={`mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px] ${
              onDark ? "text-white/70" : "text-[var(--muted)]"
            }`}
          >
            Publications
          </span>
        </span>
      )}
    </span>
  );

  if (href == null || href === "") return inner;
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center"
      aria-label="PSI Publications home"
    >
      {inner}
    </Link>
  );
}
