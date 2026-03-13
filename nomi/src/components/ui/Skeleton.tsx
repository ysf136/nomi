import { CSSProperties } from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
  style?: CSSProperties;
}

/**
 * Skeleton Component für Loading States
 * Zeigt Platzhalter während Daten geladen werden
 */
export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  variant = 'rectangular',
  animation = 'pulse',
  className,
  style,
}: SkeletonProps) {
  const getVariantStyles = (): CSSProperties => {
    switch (variant) {
      case 'text':
        return {
          height: '1em',
          width: width,
          borderRadius: 4,
        };
      case 'circular':
        return {
          width: typeof width === 'number' ? width : 40,
          height: typeof height === 'number' ? height : 40,
          borderRadius: '50%',
        };
      case 'rectangular':
      default:
        return {
          width,
          height,
          borderRadius,
        };
    }
  };

  const getAnimationClass = () => {
    if (animation === 'none') return '';
    return animation === 'pulse' ? 'skeleton-pulse' : 'skeleton-wave';
  };

  return (
    <>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes skeleton-wave {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .skeleton-pulse {
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-wave {
          background: linear-gradient(
            90deg,
            #E5E7EB 0%,
            #F3F4F6 50%,
            #E5E7EB 100%
          );
          background-size: 200% 100%;
          animation: skeleton-wave 1.5s ease-in-out infinite;
        }
      `}</style>
      <div
        className={`${getAnimationClass()} ${className || ''}`}
        style={{
          backgroundColor: animation === 'wave' ? 'transparent' : '#E5E7EB',
          ...getVariantStyles(),
          ...style,
        }}
      />
    </>
  );
}

/**
 * Skeleton für Card-Layout
 */
export function SkeletonCard() {
  return (
    <div
      className="nova-glass-static"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Skeleton width="60%" height={24} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="85%" height={16} />
      <Skeleton width="40%" height={32} style={{ marginTop: 8 }} borderRadius={8} />
    </div>
  );
}

/**
 * Skeleton für Dashboard Stats
 */
export function SkeletonStat() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton width={80} height={48} />
      <Skeleton width="70%" height={16} />
    </div>
  );
}

/**
 * Skeleton für Circular Progress
 */
export function SkeletonProgress() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Skeleton variant="circular" width={120} height={120} />
      <div style={{ flex: 1 }}>
        <Skeleton width="80%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={16} />
      </div>
    </div>
  );
}

/**
 * Skeleton für Liste
 */
interface SkeletonListProps {
  count?: number;
}

export function SkeletonList({ count = 3 }: SkeletonListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: 8,
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <div style={{ flex: 1 }}>
            <Skeleton width="40%" height={16} style={{ marginBottom: 6 }} />
            <Skeleton width="70%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton für Table Row
 */
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 16,
        padding: '1rem',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} width="80%" height={16} />
      ))}
    </div>
  );
}
