import { tokens } from '../../styles/tokens';

interface AIPoweredBadgeProps {
  variant?: 'default' | 'compact' | 'inline';
  tooltip?: string;
}

export default function AIPoweredBadge({ 
  variant = 'default', 
  tooltip = 'Dieses Feature nutzt künstliche Intelligenz für präzise Analysen' 
}: AIPoweredBadgeProps) {
  const c = tokens.colors.brand.primary;
  
  if (variant === 'compact') {
    return (
      <span
        title={tooltip}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          background: `linear-gradient(135deg, ${c}22, ${c}44)`,
          border: `1px solid ${c}`,
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 600,
          color: c,
          cursor: 'help',
        }}
      >
        <span style={{ fontSize: 12 }}>✨</span>
        KI
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <span
        title={tooltip}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 12,
          color: c,
          fontWeight: 600,
          cursor: 'help',
        }}
      >
        <span>✨</span>
        KI-unterstützt
      </span>
    );
  }

  // Default variant
  return (
    <div
      title={tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: `linear-gradient(135deg, ${c}15, ${c}30)`,
        border: `1.5px solid ${c}`,
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
        color: c,
        cursor: 'help',
        boxShadow: `0 2px 8px ${c}20`,
      }}
    >
      <span style={{ fontSize: 16 }}>✨</span>
      <span>Powered by AI</span>
    </div>
  );
}
