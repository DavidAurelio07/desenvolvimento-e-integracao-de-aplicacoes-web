import { useLayoutEffect, useRef } from "react";

// Segue a abertura do SVG e limita cada borda à área visível da janela.
export default function useDeviceScreen() {
  const deviceRef = useRef(null);
  const screenRef = useRef(null);

  useLayoutEffect(() => {
    const device = deviceRef.current;
    const artwork = device.querySelector(".device-artwork");
    const screen = screenRef.current;

    const align = () => {
      const rect = artwork.getBoundingClientRect();
      const viewport = window.visualViewport;
      const x = viewport?.offsetLeft ?? 0;
      const y = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const bounds = {
        left: rect.left + rect.width * 0.213,
        right: rect.left + rect.width * 0.741,
        top: rect.top + rect.height * 0.554,
        bottom: rect.top + rect.height * 0.912,
      };
      const left = Math.max(x, bounds.left);
      const right = Math.min(x + width, bounds.right);
      const top = Math.max(y, bounds.top);
      const bottom = Math.min(y + height, bounds.bottom);
      screen.style.setProperty("--visible-left", `${left}px`);
      screen.style.setProperty("--visible-top", `${top}px`);
      screen.style.setProperty("--visible-width", `${Math.max(0, right - left)}px`);
      screen.style.setProperty("--visible-height", `${Math.max(0, bottom - top)}px`);
      const radius = `${Math.min(rect.width * 0.052, (right - left) / 2, (bottom - top) / 2)}px`;
      const clipped = {
        tl: bounds.left < x || bounds.top < y,
        tr: bounds.right > x + width || bounds.top < y,
        bl: bounds.left < x || bounds.bottom > y + height,
        br: bounds.right > x + width || bounds.bottom > y + height,
      };
      for (const [corner, cut] of Object.entries(clipped)) {
        screen.style.setProperty(`--radius-${corner}`, cut ? "0px" : radius);
      }
    };

    align();
    const observer = new ResizeObserver(align);
    observer.observe(artwork);
    observer.observe(device);
    window.addEventListener("scroll", align, true);
    window.addEventListener("resize", align);
    window.visualViewport?.addEventListener("resize", align);
    window.visualViewport?.addEventListener("scroll", align);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", align, true);
      window.removeEventListener("resize", align);
      window.visualViewport?.removeEventListener("resize", align);
      window.visualViewport?.removeEventListener("scroll", align);
    };
  }, []);

  return { deviceRef, screenRef };
}
