/**
 * NOVA Design Tokens — Single source of truth
 * Glassmorphism + Neon Glow aesthetic
 */

// ── Colors ─────────────────────────────────────────────────
export const colors = {
  // Brand
  primary: "#3FB292",
  primaryLight: "#5FCFAD",
  primaryDark: "#2d9d7f",
  primaryGlow: "rgba(63, 178, 146, 0.35)",
  primarySubtle: "rgba(63, 178, 146, 0.08)",

  // Neutrals
  dark: "#0F1A1A",
  darkSoft: "#183939",
  text: "#1F2937",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  border: "rgba(255, 255, 255, 0.12)",
  borderSolid: "#E0E4EA",

  // Surfaces (glassmorphism)
  surfaceBase: "#0A0F1E",
  surfaceCard: "rgba(255, 255, 255, 0.06)",
  surfaceCardHover: "rgba(255, 255, 255, 0.10)",
  surfaceElevated: "rgba(255, 255, 255, 0.08)",
  surfaceOverlay: "rgba(15, 26, 26, 0.8)",

  // Light mode surfaces
  lightBg: "#F0F2F5",
  lightCard: "rgba(255, 255, 255, 0.72)",
  lightCardHover: "rgba(255, 255, 255, 0.88)",
  lightSidebar: "rgba(255, 255, 255, 0.65)",
  lightNavbar: "rgba(255, 255, 255, 0.70)",

  // Status
  success: "#10B981",
  successGlow: "rgba(16, 185, 129, 0.25)",
  warning: "#F59E0B",
  warningGlow: "rgba(245, 158, 11, 0.25)",
  danger: "#EF4444",
  dangerGlow: "rgba(239, 68, 68, 0.25)",
  info: "#6366F1",
  infoGlow: "rgba(99, 102, 241, 0.25)",

  // Gradients
  gradientPrimary: "linear-gradient(135deg, #3FB292 0%, #2d9d7f 50%, #1a8a6a 100%)",
  gradientHero: "linear-gradient(135deg, #0A0F1E 0%, #0F2828 40%, #0A1A2E 100%)",
  gradientCard: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
  gradientSidebar: "linear-gradient(180deg, rgba(15,26,30,0.95) 0%, rgba(10,18,26,0.98) 100%)",
  gradientGlow: "radial-gradient(ellipse at 50% 0%, rgba(63,178,146,0.15) 0%, transparent 70%)",

  white: "#FFFFFF",
  black: "#000000",
} as const;

// ── Typography ──────────────────────────────────────────────
export const fonts = {
  sans: "'Inter', 'Aptos', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
} as const;

export const fontSizes = {
  xs: "0.75rem",    // 12px
  sm: "0.8125rem",  // 13px
  base: "0.875rem", // 14px
  md: "1rem",       // 16px
  lg: "1.125rem",   // 18px
  xl: "1.25rem",    // 20px
  "2xl": "1.5rem",  // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem",    // 48px
} as const;

// ── Spacing ──────────────────────────────────────────────────
export const space = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
} as const;

// ── Radii ────────────────────────────────────────────────────
export const radii = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  "2xl": "24px",
  full: "9999px",
} as const;

// ── Shadows (glassmorphism oriented) ─────────────────────────
export const shadows = {
  sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
  md: "0 4px 16px rgba(0, 0, 0, 0.10)",
  lg: "0 8px 32px rgba(0, 0, 0, 0.12)",
  xl: "0 16px 48px rgba(0, 0, 0, 0.16)",
  glow: "0 0 20px rgba(63, 178, 146, 0.20)",
  glowStrong: "0 0 40px rgba(63, 178, 146, 0.30)",
  glowHover: "0 8px 32px rgba(63, 178, 146, 0.25), 0 0 20px rgba(63, 178, 146, 0.15)",
  card: "0 4px 24px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255,255,255,0.06)",
  cardHover: "0 12px 40px rgba(0, 0, 0, 0.12), 0 0 30px rgba(63, 178, 146, 0.12)",
  inset: "inset 0 1px 2px rgba(0, 0, 0, 0.06)",
  neon: "0 0 8px rgba(63, 178, 146, 0.4), 0 0 24px rgba(63, 178, 146, 0.15)",
} as const;

// ── Blur ──────────────────────────────────────────────────────
export const blur = {
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "40px",
} as const;

// ── Transitions ──────────────────────────────────────────────
export const transitions = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  base: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "400ms cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  bounce: "600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

// ── Z-Index scale ────────────────────────────────────────────
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  tooltip: 60,
} as const;

// ── Breakpoints ──────────────────────────────────────────────
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ── Composite style helpers ──────────────────────────────────
export const glass = {
  card: {
    background: colors.lightCard,
    backdropFilter: `blur(${blur.lg})`,
    WebkitBackdropFilter: `blur(${blur.lg})`,
    border: `1px solid rgba(255, 255, 255, 0.18)`,
    borderRadius: radii.xl,
    boxShadow: shadows.card,
  } as React.CSSProperties,

  cardHover: {
    background: colors.lightCardHover,
    boxShadow: shadows.cardHover,
    transform: "translateY(-2px)",
  } as React.CSSProperties,

  sidebar: {
    background: colors.lightSidebar,
    backdropFilter: `blur(${blur.xl})`,
    WebkitBackdropFilter: `blur(${blur.xl})`,
    borderRight: `1px solid rgba(255, 255, 255, 0.15)`,
  } as React.CSSProperties,

  navbar: {
    background: colors.lightNavbar,
    backdropFilter: `blur(${blur.lg})`,
    WebkitBackdropFilter: `blur(${blur.lg})`,
    borderBottom: `1px solid rgba(255, 255, 255, 0.15)`,
    boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
  } as React.CSSProperties,

  input: {
    background: "rgba(255, 255, 255, 0.50)",
    backdropFilter: `blur(${blur.sm})`,
    border: `1px solid rgba(255, 255, 255, 0.20)`,
    borderRadius: radii.md,
    transition: `all ${transitions.fast}`,
  } as React.CSSProperties,
} as const;

// ── Composite tokens object (consumed across the app) ────────
export const tokens = {
  colors: {
    brand: {
      primary: colors.primary,
      secondary: colors.primaryDark,
      primaryLight: colors.primaryLight,
      glow: colors.primaryGlow,
      subtle: colors.primarySubtle,
    },
    neutral: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: colors.borderSolid,
      300: "#D1D5DB",
      400: colors.textMuted,
      500: colors.textSecondary,
      600: "#4B5563",
      700: "#374151",
      800: colors.text,
      900: colors.darkSoft,
    } as Record<number, string>,
    status: {
      error: colors.danger,
      warning: colors.warning,
      success: colors.success,
      info: colors.info,
    },
    surface: {
      base: colors.surfaceBase,
      card: colors.surfaceCard,
      cardHover: colors.surfaceCardHover,
      elevated: colors.surfaceElevated,
      overlay: colors.surfaceOverlay,
    },
    white: colors.white,
    black: colors.black,
  },
  fonts,
  fontSizes,
  space,
  radii,
  shadows,
  blur,
  transitions,
  zIndex,
  breakpoints,
  glass,
} as const;

// Need React import for CSSProperties
import type React from "react";
