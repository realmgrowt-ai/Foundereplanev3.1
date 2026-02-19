import { useEffect, useRef, useCallback } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

interface SectionConfig {
  id: string;
  name: string;
}

interface ScrollTrackerProps {
  page: string;
  sections: SectionConfig[];
}

const getSessionId = (): string => {
  let sid = sessionStorage.getItem('fp_scroll_session');
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem('fp_scroll_session', sid);
  }
  return sid;
};

const ScrollTracker = ({ page, sections }: ScrollTrackerProps) => {
  const reachedSections = useRef<Set<string>>(new Set());
  const pendingEvents = useRef<Array<{
    page: string;
    section: string;
    section_index: number;
    total_sections: number;
    session_id: string;
    viewport_height: number;
  }>>([]);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async () => {
    if (pendingEvents.current.length === 0) return;
    const batch = [...pendingEvents.current];
    pendingEvents.current = [];
    try {
      await fetch(`${BACKEND_URL}/api/analytics/scroll-events/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
      });
    } catch {
      // silently fail — analytics should never block UX
    }
  }, []);

  const scheduleFlush = useCallback(() => {
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flush, 2000);
  }, [flush]);

  useEffect(() => {
    const sessionId = getSessionId();
    const totalSections = sections.length;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-testid');
            if (!sectionId || reachedSections.current.has(sectionId)) return;
            reachedSections.current.add(sectionId);

            const idx = sections.findIndex((s) => s.id === sectionId);
            if (idx === -1) return;

            pendingEvents.current.push({
              page,
              section: sections[idx].name,
              section_index: idx,
              total_sections: totalSections,
              session_id: sessionId,
              viewport_height: window.innerHeight,
            });
            scheduleFlush();
          }
        });
      },
      { threshold: 0.3 }
    );

    // Wait for DOM to be ready, then observe
    const timer = setTimeout(() => {
      sections.forEach((s) => {
        const el = document.querySelector(`[data-testid="${s.id}"]`);
        if (el) observer.observe(el);
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      if (flushTimer.current) clearTimeout(flushTimer.current);
      // Flush remaining on unmount
      if (pendingEvents.current.length > 0) {
        const batch = [...pendingEvents.current];
        pendingEvents.current = [];
        navigator.sendBeacon?.(
          `${BACKEND_URL}/api/analytics/scroll-events/batch`,
          new Blob([JSON.stringify(batch)], { type: 'application/json' })
        );
      }
    };
  }, [page, sections, scheduleFlush]);

  return null; // invisible tracker
};

export default ScrollTracker;
