"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SlideshowControls = {
  activeIndex: number;
  paused: boolean;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
};

export function useSlideshow(slideCount: number, intervalMs: number): SlideshowControls {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideCountRef = useRef(slideCount);
  slideCountRef.current = slideCount;
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    if (paused || slideCount <= 1 || intervalMs <= 0) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCountRef.current);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, paused, slideCount]);

  const goTo = useCallback((index: number) => {
    const count = slideCountRef.current;
    if (count <= 0) return;
    setActiveIndex(((index % count) + count) % count);
  }, []);

  return {
    activeIndex,
    paused,
    pause: useCallback(() => setPaused(true), []),
    resume: useCallback(() => setPaused(false), []),
    toggle: useCallback(() => setPaused((p) => !p), []),
    next: useCallback(() => goTo(activeIndexRef.current + 1), [goTo]),
    prev: useCallback(() => goTo(activeIndexRef.current - 1), [goTo]),
    goTo
  };
}
