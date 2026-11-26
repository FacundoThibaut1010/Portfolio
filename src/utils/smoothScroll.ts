import Lenis from 'lenis';

let lenis: Lenis | null = null;

/** Starts inertial smooth scrolling for mouse wheel / trackpad. Touch keeps native scrolling. */
export function initSmoothScroll() {
  if (lenis || typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart: quick response, soft landing
    smoothWheel: true,
    wheelMultiplier: 0.95,
  });

  let raf = 0;
  const loop = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/**
 * Where a section should land when navigated to.
 * A section can mark an inner element with `data-scroll-anchor` (e.g. its title): the page then
 * lands just above that element instead of at the section's padded top, so more content fits.
 */
function targetFor(id: string): number | null {
  const section = document.getElementById(id);
  if (!section) return null;
  const anchor = section.querySelector<HTMLElement>('[data-scroll-anchor]');
  const el = anchor ?? section;
  const top = el.getBoundingClientRect().top + window.scrollY;
  if (!anchor) return top;
  const mobileNav = window.innerWidth < 1024 ? 76 : 0; // fixed top bar on mobile
  return Math.max(0, top - mobileNav - 20);
}

export function scrollToId(id: string, opts: { immediate?: boolean } = {}) {
  const go = () => {
    const y = targetFor(id);
    if (y === null) return;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(y, { immediate: opts.immediate, duration: 1.2, force: true });
    } else {
      window.scrollTo({ top: y, behavior: opts.immediate ? 'auto' : 'smooth' });
    }
  };
  if (opts.immediate) {
    // Wait for React to commit and the browser to lay out sections that just re-mounted
    requestAnimationFrame(() => requestAnimationFrame(go));
  } else {
    go();
  }
}

/** Jump to the very top once the next layout is ready (used when a project opens and the page changes height). */
export function jumpToTop() {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }),
  );
}

export function stopSmoothScroll(stop: boolean) {
  if (!lenis) return;
  if (stop) lenis.stop();
  else lenis.start();
}
