"use client";

type Props = {
  open: boolean;
  status: "preparing" | "open" | "confirming";
  amountLabel?: string | null;
};

/**
 * Full-screen PSI brand shell shown while Paystack popup loads / payment confirms.
 * Logo + name sit above the Paystack iframe area.
 */
export function PaystackBrandOverlay({ open, status, amountLabel }: Props) {
  if (!open) return null;

  const paystackVisible = status === "open";
  const message =
    status === "confirming"
      ? "Confirming your payment…"
      : paystackVisible
        ? "Complete payment in the secure Paystack window"
        : "Preparing secure checkout…";

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col ${
        paystackVisible
          ? "pointer-events-none bg-[var(--ink)]/55"
          : "bg-[var(--ink)]/92 backdrop-blur-md"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Payment in progress"
    >
      {/* Brand header — stays on top of the Paystack pop */}
      <header className="pointer-events-auto relative z-[210] flex items-center justify-center gap-3 border-b border-white/10 bg-[var(--ink)] px-4 py-4 shadow-lg sm:py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-psi-on-dark.png"
          alt="PSI Publications"
          className="h-10 w-auto object-contain sm:h-12"
        />
        <div className="min-w-0 text-left">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white sm:text-xl">
            PSI Publications
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-orange)]">
            Secure APC checkout
          </p>
        </div>
      </header>

      {!paystackVisible ? (
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-10 text-center">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(110,31,58,0.4),_transparent_60%)]"
            aria-hidden
          />

          <div className="relative flex flex-col items-center">
            <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
              <span className="psi-spinner-ring absolute inset-0 rounded-full border-[1.5px] border-white/15 border-t-white border-r-white/60" />
              <span className="psi-spinner-ring-rev absolute inset-[18%] rounded-full border border-transparent border-b-[#e8a0b2]/80" />
              <span className="relative font-[family-name:var(--font-display)] text-2xl font-bold leading-none text-white">
                ψ
              </span>
            </div>

            <p className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-white">
              psi
            </p>
            <h2 className="mt-2 max-w-sm font-[family-name:var(--font-display)] text-2xl text-white sm:text-3xl">
              {message}
            </h2>
            {amountLabel ? (
              <p className="mt-3 rounded-sm bg-white/10 px-4 py-1.5 text-sm font-semibold text-white ring-1 ring-white/15">
                APC due: {amountLabel} USD
              </p>
            ) : null}
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              Your payment is processed securely by Paystack. Do not close this
              window until checkout finishes.
            </p>

            <div className="psi-loader-dots mt-8 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e8a0b2]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#e8a0b2]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#e8a0b2]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="pointer-events-none flex flex-1 items-start justify-center px-4 pt-3">
          <p className="rounded-full bg-[var(--ink)]/80 px-4 py-1.5 text-xs font-medium text-white/85 ring-1 ring-white/10">
            {message}
            {amountLabel ? ` · ${amountLabel} USD` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
