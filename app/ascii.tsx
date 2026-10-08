"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// Characters flashed while a piece "decodes". No backslash or backtick.
const NOISE = "@#%&8BWM*+=-:;.'";
// Light characters the hero sky twinkles between.
const TWINKLE = ".',:;- ";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function blank(text: string) {
  return text.replace(/[^\n]/g, " ");
}

function artMetrics(art: string) {
  const text = art.replace(/^\n/, "");
  const lines = text.split("\n");
  const style = {
    "--cols": Math.max(...lines.map((line) => line.length)),
    "--rows": lines.length,
  } as CSSProperties;
  return { text, style };
}

/* Resolve `text` out of random noise over `duration` ms, writing into each text node.
   Returns a cancel function. */
function decode(nodes: Text[], text: string, duration: number, onDone?: () => void) {
  const chars = [...text];
  const n = chars.length;
  // Mostly random order with a slight top-to-bottom sweep.
  const delays = chars.map((c, i) => (c === "\n" || c === " " ? 0 : Math.random() * 0.72 + (i / n) * 0.28));
  const start = performance.now();
  let raf = 0;

  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    let out = "";
    for (let i = 0; i < n; i++) {
      const c = chars[i];
      if (c === "\n" || c === " " || t >= delays[i]) out += c;
      else if (t >= delays[i] - 0.16) out += NOISE[(Math.random() * NOISE.length) | 0];
      else out += " ";
    }
    for (const node of nodes) node.nodeValue = out;
    if (t < 1) {
      raf = requestAnimationFrame(frame);
    } else {
      for (const node of nodes) node.nodeValue = text;
      onDone?.();
    }
  };
  raf = requestAnimationFrame(frame);

  return () => cancelAnimationFrame(raf);
}

/* ASCII art scaled to its positioned parent; decodes out of noise the first time it scrolls into view.
   `cover` fills and crops like object-fit: cover; `contain` keeps the whole piece visible. */
export function AsciiArt({
  art,
  label,
  fit = "cover",
}: {
  art: string;
  label?: string;
  fit?: "contain" | "cover";
}) {
  const { text, style } = artMetrics(art);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    const node = el?.firstChild;
    if (!el || !(node instanceof Text) || reducedMotion()) return;

    node.nodeValue = blank(text);
    let cancel: (() => void) | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        cancel = decode([node], text, 1100);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancel?.();
      node.nodeValue = text;
    };
  }, [text]);

  return (
    <span
      className={`ascii ascii--${fit}`}
      style={style}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <span ref={textRef} className="ascii-text">
        {text}
      </span>
    </span>
  );
}

/* The hero scene: decodes once `active` turns true, then the sky twinkles and the pointer works as a
   flashlight that brings out the art underneath it. */
export function HeroAscii({ art, active }: { art: string; active: boolean }) {
  const { text, style } = artMetrics(art);
  const rootRef = useRef<HTMLSpanElement>(null);
  const baseRef = useRef<HTMLSpanElement>(null);
  const litRef = useRef<HTMLSpanElement>(null);

  // Hide the art until the loader is gone, then decode and start twinkling.
  useEffect(() => {
    const base = baseRef.current?.firstChild;
    const lit = litRef.current?.firstChild;
    if (!(base instanceof Text) || !(lit instanceof Text) || reducedMotion()) return;
    const nodes = [base, lit];

    if (!active) {
      for (const node of nodes) node.nodeValue = blank(text);
      return () => {
        for (const node of nodes) node.nodeValue = text;
      };
    }

    let twinkle = 0;
    const cancel = decode(nodes, text, 1600, () => {
      const chars = [...text];
      const lines = text.split("\n");
      // the sky is roughly the top 55% of rows
      const skyEnd = lines.slice(0, Math.floor(lines.length * 0.55)).join("\n").length;
      const sky: number[] = [];
      for (let i = 0; i < skyEnd; i++) if (chars[i] !== "\n" && TWINKLE.includes(chars[i])) sky.push(i);
      if (!sky.length) return;

      twinkle = window.setInterval(() => {
        for (let k = 0; k < 14; k++) {
          const i = sky[(Math.random() * sky.length) | 0];
          chars[i] = TWINKLE[(Math.random() * TWINKLE.length) | 0];
        }
        const out = chars.join("");
        for (const node of nodes) node.nodeValue = out;
      }, 140);
    });

    return () => {
      cancel();
      window.clearInterval(twinkle);
      for (const node of nodes) node.nodeValue = text;
    };
  }, [active, text]);

  // Flashlight: follow the pointer over the hero frame (mouse / pen only).
  useEffect(() => {
    const root = rootRef.current;
    const lit = litRef.current;
    const frame = root?.closest<HTMLElement>(".image-frame");
    if (!root || !lit || !frame || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = lit.getBoundingClientRect();
      lit.style.setProperty("--mx", `${e.clientX - r.left}px`);
      lit.style.setProperty("--my", `${e.clientY - r.top}px`);
      frame.classList.add("is-lit");
    };
    const onLeave = () => frame.classList.remove("is-lit");

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      frame.classList.remove("is-lit");
    };
  }, []);

  return (
    <span ref={rootRef} className="ascii ascii--cover" style={style} aria-hidden="true">
      <span ref={baseRef} className="ascii-text">
        {text}
      </span>
      <span ref={litRef} className="ascii-text ascii-lit">
        {text}
      </span>
    </span>
  );
}

/* Radio transcript that types itself out the first time it scrolls into view. Screen readers get the
   full text immediately. Clicking the panel finishes it. */
export function Transmission({ text }: { text: string }) {
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = typedRef.current;
    const node = el?.firstChild;
    if (!el || !(node instanceof Text) || reducedMotion()) return;

    node.nodeValue = "";
    el.dataset.state = "idle";
    let raf = 0;
    let pause = 0;
    let shown = 0;
    const panel = el.closest<HTMLElement>(".transmission");

    const finish = () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(pause);
      shown = text.length;
      node.nodeValue = text;
      el.dataset.state = "done";
    };

    const start = () => {
      el.dataset.state = "typing";
      let last = performance.now();
      const frame = (now: number) => {
        // ~60 characters per second, with a short pause after sentence breaks
        shown = Math.min(text.length, shown + ((now - last) / 1000) * 60);
        last = now;
        const i = Math.floor(shown);
        node.nodeValue = text.slice(0, i);
        if (i >= text.length) return finish();
        if (/[.,]/.test(text[i - 1] ?? "") && text[i] === " ") {
          // step past the space so the pause happens once per break
          shown = i + 1;
          pause = window.setTimeout(() => {
            last = performance.now();
            raf = requestAnimationFrame(frame);
          }, 220);
          return;
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    panel?.addEventListener("click", finish);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(pause);
      panel?.removeEventListener("click", finish);
      node.nodeValue = text;
      delete el.dataset.state;
    };
  }, [text]);

  return (
    <p className="transmission-text">
      <span className="sr-only">{text}</span>
      {/* invisible full copy reserves the final height so the page doesn't shift while typing */}
      <span className="transmission-ghost" aria-hidden="true">
        {text}
      </span>
      <span className="transmission-live" aria-hidden="true">
        <span ref={typedRef} className="transmission-typed">
          {text}
        </span>
        <span className="transmission-caret" />
      </span>
    </p>
  );
}
