"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import {
  ensureManuscriptHtml,
  htmlToPlainText,
  sanitizeManuscriptHtml,
} from "@/lib/import-manuscript";

type CommonProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Soft outline while focused so the insert point is obvious. */
  showFocusRing?: boolean;
};

type PlainProps = CommonProps & {
  mode?: "plain";
  /** If true, Enter inserts a line break instead of submitting. */
  multiline?: boolean;
  as?: "h1" | "p" | "span" | "div";
};

type HtmlProps = CommonProps & {
  mode: "html";
  as?: "div";
  multiline?: never;
};

type Props = (PlainProps | HtmlProps) &
  Omit<HTMLAttributes<HTMLElement>, "onChange" | "value" | "placeholder">;

/**
 * In-template contentEditable field with a real blinking caret.
 * Keeps React state in sync without fighting the caret on every keystroke.
 */
export function TemplateEditable({
  value,
  onChange,
  placeholder = "Click to type…",
  className = "",
  showFocusRing = true,
  mode = "plain",
  multiline = false,
  as,
  ...rest
}: Props) {
  const Tag = (as || (mode === "html" ? "div" : "p")) as "div";
  const ref = useRef<HTMLElement>(null);
  const lastEmitted = useRef(value);
  const seeded = useRef(false);

  const readValue = useCallback(() => {
    const el = ref.current;
    if (!el) return "";
    if (mode === "html") {
      return sanitizeManuscriptHtml(el.innerHTML);
    }
    return (el.innerText || "").replace(/\u00a0/g, " ").trimEnd();
  }, [mode]);

  const emit = useCallback(() => {
    const el = ref.current;
    if (el && mode === "html") {
      // Tag blank paragraphs before serialize so spacing survives sanitize/blur
      // and shows in print preview / PDF.
      el.querySelectorAll(":scope > p").forEach((p) => {
        if (!(p instanceof HTMLElement)) return;
        const text = (p.textContent || "").replace(/\u00a0/g, " ").trim();
        const hasOnlyBreaks =
          !text &&
          Boolean(p.querySelector("br")) &&
          !p.querySelector("img, table, figure, .nahda-table-wrap");
        const isEmpty = !text && !p.querySelector("img, table, figure");
        if (hasOnlyBreaks || isEmpty) {
          p.classList.add("nahda-spacer");
          // &nbsp; keeps a line box in preview/print; bare <br> often collapses.
          if (!text) p.innerHTML = "\u00a0";
        } else {
          p.classList.remove("nahda-spacer");
        }
      });
    }
    const next = readValue();
    lastEmitted.current = next;
    if (el) {
      const empty =
        mode === "html"
          ? !htmlToPlainText(next).trim()
          : !next.trim();
      el.dataset.empty = empty ? "true" : "false";
    }
    onChange(next);
  }, [onChange, readValue, mode]);

  /** On blur, normalize References into a numbered list and keep footer matter out. */
  const emitNormalized = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (mode !== "html") {
      emit();
      return;
    }
    const normalized = ensureManuscriptHtml(el.innerHTML);
    const html = normalized.trim() ? normalized : "";
    if (html && html !== el.innerHTML) {
      el.innerHTML = html;
    } else if (!html) {
      el.innerHTML = "<p><br></p>";
    }
    lastEmitted.current = html;
    el.dataset.empty = htmlToPlainText(html).trim() ? "false" : "true";
    onChange(html);
  }, [emit, mode, onChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (mode === "html") {
      let html = ensureManuscriptHtml(value);
      // Leave a clickable empty paragraph so the caret can be placed.
      if (!html.trim()) html = "<p><br></p>";
      if (!seeded.current) {
        el.innerHTML = html;
        lastEmitted.current = html === "<p><br></p>" ? "" : html;
        seeded.current = true;
        if (html !== value && html !== "<p><br></p>") onChange(html);
        return;
      }
      if (value === lastEmitted.current) return;
      // Don't wipe the caret while the user is typing in this field.
      if (document.activeElement === el) return;
      const next = ensureManuscriptHtml(value);
      el.innerHTML = next.trim() ? next : "<p><br></p>";
      lastEmitted.current = next;
      return;
    }

    if (!seeded.current) {
      el.textContent = value;
      lastEmitted.current = value;
      seeded.current = true;
      return;
    }
    if (value === lastEmitted.current) return;
    if (document.activeElement === el) return;
    el.textContent = value;
    lastEmitted.current = value;
  }, [value, mode, onChange]);

  function markSpacerParagraphs(root: HTMLElement) {
    root.querySelectorAll(":scope > p").forEach((p) => {
      if (!(p instanceof HTMLElement)) return;
      const text = (p.textContent || "").replace(/\u00a0/g, " ").trim();
      const hasOnlyBreaks =
        !text &&
        Boolean(p.querySelector("br")) &&
        !p.querySelector("img, table, figure, .nahda-table-wrap");
      const isEmpty = !text && !p.querySelector("img, table, figure");
      if (hasOnlyBreaks || isEmpty) {
        p.classList.add("nahda-spacer");
        if (!text) p.innerHTML = "\u00a0";
      } else {
        p.classList.remove("nahda-spacer");
      }
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (mode === "plain" && !multiline && e.key === "Enter") {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
      return;
    }

    if (mode !== "html" || e.key !== "Enter" || e.shiftKey) return;

    const root = ref.current;
    if (!root) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return;

    const node = sel.anchorNode;
    const start =
      node instanceof HTMLElement ? node : node?.parentElement;
    if (!start || !root.contains(start)) return;

    // Enter inside a figure (not the caption) → insert a spacer after the figure
    // so gaps between table/image and following text actually appear.
    const fig = start.closest("figure");
    if (fig && root.contains(fig) && !start.closest("figcaption")) {
      e.preventDefault();
      const spacer = document.createElement("p");
      spacer.className = "nahda-spacer";
      spacer.innerHTML = "\u00a0";
      fig.after(spacer);
      const range = document.createRange();
      range.setStart(spacer, 0);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      emit();
      return;
    }

    // After the browser inserts the new paragraph, mark blank lines as spacers.
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      markSpacerParagraphs(el);
      emit();
    });
  }

  const empty =
    mode === "html"
      ? !htmlToPlainText(value).trim()
      : !value.trim();

  return (
    <Tag
      {...rest}
      ref={ref as never}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline={mode === "html" || multiline}
      data-placeholder={placeholder}
      data-empty={empty ? "true" : "false"}
      data-nahda-rich="true"
      className={`nahda-template-editable outline-none min-w-0 max-w-full ${
        showFocusRing
          ? "rounded-sm focus:ring-1 focus:ring-[var(--j-primary)]/35"
          : ""
      } ${className}`}
      style={{
        caretColor: "var(--j-primary, #1d4e89)",
        ...(rest.style || {}),
      }}
      onInput={emit}
      onBlur={emitNormalized}
      onKeyDown={onKeyDown}
    />
  );
}
