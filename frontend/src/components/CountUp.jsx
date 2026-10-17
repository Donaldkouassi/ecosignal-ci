import React, { useEffect, useRef, useState } from "react";

const DURATION_MS = 900;

function CountUp({ value }) {
  const nodeRef = useRef(null);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !Number.isFinite(value)) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayed(value);
      return undefined;
    }

    let frame;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - (1 - progress) ** 3;
          setDisplayed(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={nodeRef}>{displayed}</span>;
}

export default CountUp;
