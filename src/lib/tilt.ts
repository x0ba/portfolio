import { useEffect, useRef, useCallback } from "react";

const supportsHover =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover)").matches;

export function attachTilt(el: HTMLElement, maxDeg = 6): () => void {
  if (!supportsHover) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = y * -maxDeg * 2;
    const rotateY = x * maxDeg * 2;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    el.style.transition = "transform 0.1s ease";
  };

  const handleMouseLeave = () => {
    el.style.transform = "";
    el.style.transition = "transform 0.3s ease";
  };

  el.addEventListener("mousemove", handleMouseMove);
  el.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    el.removeEventListener("mousemove", handleMouseMove);
    el.removeEventListener("mouseleave", handleMouseLeave);
    el.style.transform = "";
  };
}

export function useTilt<T extends HTMLElement>(maxDeg = 6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    return attachTilt(ref.current, maxDeg);
  }, [maxDeg]);

  return ref;
}
