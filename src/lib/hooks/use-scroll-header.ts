import { useEffect, useRef, useState } from "react";

const TOP_THRESHOLD = 16;
const DELTA_THRESHOLD = 6;

export function getHeaderVisibility(
  scrollY: number,
  lastScrollY: number,
  wasVisible: boolean,
): boolean {
  if (scrollY <= TOP_THRESHOLD) return true;

  const delta = scrollY - lastScrollY;
  if (delta > DELTA_THRESHOLD) return false;
  if (delta < -DELTA_THRESHOLD) return true;
  return wasVisible;
}

export function useScrollHeaderVisible(disabled = false) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (disabled) return;

    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      setIsVisible((wasVisible) =>
        getHeaderVisibility(scrollY, lastScrollY, wasVisible),
      );
      lastScrollYRef.current = scrollY;
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [disabled]);

  return disabled ? true : isVisible;
}
