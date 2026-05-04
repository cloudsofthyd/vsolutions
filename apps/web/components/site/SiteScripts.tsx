"use client";

import { useEffect } from "react";

// Ports the inline <script> from homepage HTML: cursor glow follow, scroll fade-up
// observer with stat counter, card mouse-tilt, and showcase slider auto-rotation.

export function SiteScripts() {
  useEffect(() => {
    // ── Cursor glow ────────────────────────────────────────────────────────────
    let animFrame = 0;
    const cursorGlow = document.getElementById("cursorGlow");
    let onMove: ((e: MouseEvent) => void) | null = null;
    if (cursorGlow) {
      let glowX = window.innerWidth / 2;
      let glowY = window.innerHeight / 2;
      let targetX = glowX;
      let targetY = glowY;
      onMove = (e: MouseEvent) => {
        targetX = e.clientX;
        targetY = e.clientY;
      };
      document.addEventListener("mousemove", onMove);
      const animate = () => {
        glowX += (targetX - glowX) * 0.15;
        glowY += (targetY - glowY) * 0.15;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        animFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    // ── Scroll fade-in (opt-in, never hides above-the-fold content) ───────────
    const prefersReduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let revealIo: IntersectionObserver | null = null;
    if (!prefersReduce) {
      const fadeEls = document.querySelectorAll<HTMLElement>(".fade-up");
      const offscreenThreshold = window.innerHeight * 0.85;
      fadeEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Only animate sections that are below the initial viewport — anything
        // already on screen stays as-is (no flash).
        if (rect.top > offscreenThreshold) {
          el.classList.add("fade-up--init");
        }
      });
      revealIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.remove("fade-up--init");
              revealIo!.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      document
        .querySelectorAll(".fade-up.fade-up--init")
        .forEach((el) => revealIo!.observe(el));
    }

    // ── Stat counters (animation only — content already visible) ───────────────
    const triggerCounters = (root: Element) => {
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        if (el.dataset.counted) return;
        el.dataset.counted = "1";
        const target = parseInt(el.dataset.count!, 10);
        if (!Number.isFinite(target)) return;
        let current = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = String(Math.floor(current));
        }, 25);
      });
    };

    const counterIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            triggerCounters(e.target);
            counterIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    document.querySelectorAll("[data-count]").forEach((el) => {
      const host = el.closest("section") || el.parentElement;
      if (host) counterIo.observe(host);
    });

    // ── Card mouse tilt ────────────────────────────────────────────────────────
    const tiltCards = document.querySelectorAll<HTMLElement>(
      ".service-card, .why-card, .post-card",
    );
    const tiltMove = (card: HTMLElement) => (ev: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ev.clientX - rect.left - rect.width / 2;
      const y = ev.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * -3;
      const tiltY = (x / rect.width) * 3;
      card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };
    const tiltLeave = (card: HTMLElement) => () => {
      card.style.transform = "";
    };
    const cardHandlers = Array.from(tiltCards).map((card) => {
      const m = tiltMove(card);
      const l = tiltLeave(card);
      card.addEventListener("mousemove", m);
      card.addEventListener("mouseleave", l);
      return { card, m, l };
    });

    // ── Showcase auto-rotation ─────────────────────────────────────────────────
    const tabs = document.querySelectorAll<HTMLElement>(".showcase-tab");
    const slides = document.querySelectorAll<HTMLElement>(".showcase-slide");
    const progressBar = document.getElementById("showcaseProgress");
    const SLIDE_DURATION = 6000;
    let currentIndex = 0;
    let progressStart = Date.now();
    let timer: ReturnType<typeof setInterval> | null = null;
    let paused = false;

    const showSlide = (index: number) => {
      tabs.forEach((t, i) => t.classList.toggle("active", i === index));
      slides.forEach((s, i) => s.classList.toggle("active", i === index));
      currentIndex = index;
      progressStart = Date.now();
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
        requestAnimationFrame(() => {
          progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
          progressBar.style.width = "100%";
        });
      }
    };
    const next = () => {
      if (paused || slides.length === 0) return;
      showSlide((currentIndex + 1) % slides.length);
    };
    const startTimer = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(next, SLIDE_DURATION);
    };
    const tabHandlers = Array.from(tabs).map((tab, i) => {
      const h = () => {
        showSlide(i);
        startTimer();
      };
      tab.addEventListener("click", h);
      return { tab, h };
    });
    const shell = document.querySelector(".showcase-shell");
    const onShellEnter = () => {
      paused = true;
      const elapsed = Date.now() - progressStart;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = `${pct}%`;
      }
    };
    const onShellLeave = () => {
      paused = false;
      const remaining = SLIDE_DURATION - (Date.now() - progressStart);
      if (progressBar) {
        progressBar.style.transition = `width ${Math.max(0, remaining)}ms linear`;
        progressBar.style.width = "100%";
      }
    };
    if (shell) {
      shell.addEventListener("mouseenter", onShellEnter);
      shell.addEventListener("mouseleave", onShellLeave);
    }
    if (slides.length > 0) {
      showSlide(0);
      startTimer();
    }

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (onMove) document.removeEventListener("mousemove", onMove);
      if (revealIo) revealIo.disconnect();
      counterIo.disconnect();
      cardHandlers.forEach(({ card, m, l }) => {
        card.removeEventListener("mousemove", m);
        card.removeEventListener("mouseleave", l);
      });
      tabHandlers.forEach(({ tab, h }) => tab.removeEventListener("click", h));
      if (shell) {
        shell.removeEventListener("mouseenter", onShellEnter);
        shell.removeEventListener("mouseleave", onShellLeave);
      }
      if (timer) clearInterval(timer);
    };
  }, []);

  return null;
}
