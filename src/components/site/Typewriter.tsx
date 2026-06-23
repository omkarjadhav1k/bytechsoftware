import { useEffect, useState } from "react";

export function Typewriter({
  text,
  speed = 45,
  startDelay = 200,
  className = "",
  onDone,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  onDone?: () => void;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (count >= text.length) {
      onDone?.();
      return;
    }
    const ch = text[count];
    // Vary cadence slightly for natural feel; pause longer on spaces/punctuation
    const delay =
      ch === " " ? speed * 0.6 : /[,.!?;:]/.test(ch) ? speed * 6 : speed + Math.random() * 40;
    const t = setTimeout(() => setCount((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [count, started, text, speed, onDone]);

  return (
    <span className={className}>
      <span>{text.slice(0, count)}</span>
      <span
        aria-hidden
        className="tw-caret"
        style={{
          display: "inline-block",
          width: "0.06em",
          height: "0.95em",
          marginLeft: "0.02em",
          verticalAlign: "-0.12em",
          background:
            "linear-gradient(180deg, #4285F4 0%, #9B72F2 35%, #E94A88 65%, #F4B400 100%)",
          borderRadius: "2px",
          animation: "tw-blink 1s steps(1) infinite",
          boxShadow: "0 0 18px rgba(155,114,242,0.55)",
        }}
      />
    </span>
  );
}
