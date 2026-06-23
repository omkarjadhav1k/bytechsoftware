import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 });
  const sx2 = useSpring(x, { stiffness: 25, damping: 18, mass: 1.2 });
  const sy2 = useSpring(y, { stiffness: 25, damping: 18, mass: 1.2 });

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    >
      <motion.div
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute h-[40rem] w-[40rem] rounded-full opacity-60"
        // soft primary glow
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, hsl(var(--primary) / 0.35), hsl(var(--primary) / 0.08) 35%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>
      <motion.div
        style={{
          x: sx2,
          y: sy2,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute h-[28rem] w-[28rem] rounded-full opacity-50"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, hsl(var(--accent) / 0.4), transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>
    </div>
  );
}

export default CursorGlow;
