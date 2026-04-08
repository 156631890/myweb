"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorPosition.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseEnter = () => setIsVisible(true);

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    // Add hover listeners to interactive elements
    const addInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select, .cursor-hover"
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleHoverStart);
        el.addEventListener("mouseleave", handleHoverEnd);
      });
    };

    // Initial setup
    addInteractiveListeners();

    // Use MutationObserver to watch for dynamically added elements
    const observer = new MutationObserver(() => {
      addInteractiveListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Smooth cursor animation
    const animate = () => {
      const cursor = cursorRef.current;
      const dot = dotRef.current;

      if (cursor && dot) {
        // Smooth cursor follows with lerp
        const lerp = 0.15;
        dotPosition.current.x +=
          (cursorPosition.current.x - dotPosition.current.x) * lerp;
        dotPosition.current.y +=
          (cursorPosition.current.y - dotPosition.current.y) * lerp;

        cursor.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px) translate(-50%, -50%)`;
        dot.style.transform = `translate(${dotPosition.current.x}px, ${dotPosition.current.y}px) translate(-50%, -50%)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();

      // Clean up interactive listeners
      const interactiveElements = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select, .cursor-hover"
      );
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        id="custom-cursor"
        className={`fixed top-0 left-0 w-5 h-5 border border-champagne rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 ${isHovered ? "hover" : ""} ${isVisible ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={dotRef}
        id="cursor-dot"
        className={`fixed top-0 left-0 w-1 h-1 bg-champagne rounded-full pointer-events-none z-[9999] ${isVisible ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
