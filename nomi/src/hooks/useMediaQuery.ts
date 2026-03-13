/**
 * NOVA - Media Query Hook
 * React Hook für responsive Breakpoints
 */

import { useState, useEffect } from 'react';

/**
 * NOVA Breakpoints
 * Mobile-first approach
 */
export const BREAKPOINTS = {
  xs: 0,      // 0px+
  sm: 640,    // 640px+ (Tablets im Portrait)
  md: 768,    // 768px+ (Tablets im Landscape)
  lg: 1024,   // 1024px+ (Desktop)
  xl: 1280,   // 1280px+ (Large Desktop)
  '2xl': 1536, // 1536px+ (Extra Large)
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Hook: useMediaQuery
 * Erkennt, ob eine Media Query zutrifft
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // SSR-safe: Check if window exists
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Update state wenn sich die Media Query ändert
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Modern API (addEventListener)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback für ältere Browser (deprecated)
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Hook: useBreakpoint
 * Gibt den aktuellen Breakpoint zurück
 * 
 * @example
 * const breakpoint = useBreakpoint(); // 'sm' | 'md' | 'lg' | ...
 */
export function useBreakpoint(): BreakpointKey {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS['2xl']) setBreakpoint('2xl');
      else if (width >= BREAKPOINTS.xl) setBreakpoint('xl');
      else if (width >= BREAKPOINTS.lg) setBreakpoint('lg');
      else if (width >= BREAKPOINTS.md) setBreakpoint('md');
      else if (width >= BREAKPOINTS.sm) setBreakpoint('sm');
      else setBreakpoint('xs');
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * Hook: Mobile/Tablet/Desktop Detection
 */
export function useDeviceType() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);

  return { isMobile, isTablet, isDesktop };
}

/**
 * Helper: useIsMobile
 * Shortcut für Mobile Detection
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

/**
 * Helper: useIsTablet
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  );
}

/**
 * Helper: useIsDesktop
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

/**
 * Responsive CSS Helper
 */
export const responsive = {
  mobile: `@media (max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
};

export default useMediaQuery;
