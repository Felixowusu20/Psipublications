type Variant = "screen" | "panel" | "inline" | "dark";

type Props = {
  /** Short status line, e.g. "Loading your manuscript…" */
  label?: string;
  variant?: Variant;
  className?: string;
};

const SIZES: Record<Variant, { ring: string; glyph: string; text: string }> = {
  screen: { ring: "h-16 w-16", glyph: "text-2xl", text: "text-base" },
  dark: { ring: "h-16 w-16", glyph: "text-2xl", text: "text-base" },
  panel: { ring: "h-12 w-12", glyph: "text-xl", text: "text-sm" },
  inline: { ring: "h-8 w-8", glyph: "text-base", text: "text-sm" },
};

/**
 * PSI brand loader — thin editorial spinner + serif Ψ mark.
 * Distinct from the old Nahda favicon-pump / sliding bar treatment.
 */
export function PSILoader({ label, variant = "panel", className }: Props) {
  const size = SIZES[variant];
  const onDark = variant === "dark";

  const wrapper =
    variant === "screen" || variant === "dark"
      ? "flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 px-6 py-16"
      : variant === "panel"
        ? "flex w-full flex-col items-center justify-center gap-3.5 px-6 py-12"
        : "flex w-full items-center justify-center gap-3 px-4 py-5";

  const isRow = variant === "inline";

  return (
    <div
      className={`${wrapper} ${className ?? ""}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`relative flex ${size.ring} items-center justify-center`}
        aria-hidden
      >
        {/* Outer thin arc — spins */}
        <span
          className={`psi-spinner-ring absolute inset-0 rounded-full border-[1.5px] ${
            onDark
              ? "border-white/15 border-t-white border-r-white/60"
              : "border-[var(--accent)]/15 border-t-[var(--accent)] border-r-[var(--accent)]/70"
          }`}
        />
        {/* Inner counter-arc */}
        <span
          className={`psi-spinner-ring-rev absolute inset-[18%] rounded-full border ${
            onDark
              ? "border-transparent border-b-[#e8a0b2]/80"
              : "border-transparent border-b-[var(--accent)]/55"
          }`}
        />
        <span
          className={`relative font-[family-name:var(--font-display)] font-bold leading-none ${size.glyph} ${
            onDark ? "text-white" : "text-[var(--accent)]"
          }`}
        >
          ψ
        </span>
      </div>

      <div className={isRow ? "text-left" : "text-center"}>
        {!isRow && (
          <p
            className={`font-[family-name:var(--font-display)] text-[0.95rem] font-bold tracking-tight ${
              onDark ? "text-white" : "text-[var(--ink)]"
            }`}
          >
            psi
          </p>
        )}
        <p
          className={`${isRow ? "" : "mt-0.5"} ${size.text} ${
            onDark ? "text-white/70" : "text-[var(--muted)]"
          }`}
        >
          {label ?? "Loading…"}
        </p>
      </div>

      {!isRow && (
        <div className="psi-loader-dots flex items-center gap-1.5" aria-hidden>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              onDark ? "bg-[#e8a0b2]" : "bg-[var(--accent)]"
            }`}
          />
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              onDark ? "bg-[#e8a0b2]" : "bg-[var(--accent)]"
            }`}
          />
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              onDark ? "bg-[#e8a0b2]" : "bg-[var(--accent)]"
            }`}
          />
        </div>
      )}
    </div>
  );
}
