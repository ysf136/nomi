import type { CSSProperties, ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adds the subtle neon glow border on hover */
  glow?: boolean;
  /** Disable hover lift effect */
  flat?: boolean;
  /** Extra padding preset */
  padding?: "sm" | "md" | "lg";
  /** Additional inline styles */
  style?: CSSProperties;
}

const PADDING_MAP = {
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
};

export default function GlassCard({
  children,
  glow = false,
  flat = false,
  padding = "md",
  className = "",
  style,
  ...rest
}: GlassCardProps) {
  const classes = [
    flat ? "nova-glass-static" : "nova-glass",
    glow ? "nova-glow-border" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{ padding: PADDING_MAP[padding], ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
