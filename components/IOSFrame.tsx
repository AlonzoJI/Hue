import React from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
export const C = {
  bg: '#F5F5F5',
  card: '#ffffff',
  border: '#e5e7eb',
  divider: '#f0f0f0',
  text: '#0a0a0a',
  textSec: '#6b7280',
  textMuted: '#9ca3af',
  blue: '#2563EB',
  blueDark: '#1d4ed8',
  purple: '#7c3aed',
  red: '#ef4444',
  amber: '#f59e0b',
  green: '#16a34a',
};

export const F = {
  sans: "'Space Grotesk', sans-serif",
  mono: "'Space Mono', monospace",
};

// ─── IOSDevice ────────────────────────────────────────────────────────────────
interface IOSDeviceProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export const IOSDevice: React.FC<IOSDeviceProps> = ({ children, width = 390, height = 844 }) => (
  <div style={{
    width, height, background: C.bg, borderRadius: 50, flexShrink: 0,
    boxShadow: '0 0 0 1px #d0d0d0, 0 30px 80px rgba(0,0,0,0.18), inset 0 0 0 1px #fff',
    overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column',
    fontFamily: F.sans,
  }}>
    {/* Dynamic Island */}
    <div style={{
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      width: 120, height: 36, background: '#000', borderRadius: 20, zIndex: 30,
      pointerEvents: 'none',
    }} />
    {children}
  </div>
);

// ─── StatusBar ────────────────────────────────────────────────────────────────
export const StatusBar: React.FC = () => (
  <div style={{
    height: 50, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '14px 28px 0',
    flexShrink: 0, position: 'relative', zIndex: 10,
  }}>
    <span style={{ fontFamily: F.mono, fontSize: 15, fontWeight: 600, color: C.text, letterSpacing: '-0.3px' }}>
      9:41
    </span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: C.text }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="14" width="4" height="6" rx="1"/>
        <rect x="8" y="10" width="4" height="10" rx="1"/>
        <rect x="14" y="6" width="4" height="14" rx="1"/>
        <rect x="20" y="2" width="4" height="18" rx="1" opacity="0.3"/>
      </svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M5 12.55a11 11 0 0 1 14 0"/>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
        <circle cx="12" cy="20" r="1" fill="currentColor"/>
      </svg>
      <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="1" y="7" width="18" height="10" rx="2"/>
        <path d="M23 11v2" strokeWidth="3" strokeLinecap="round"/>
        <rect x="3" y="9" width="13" height="6" rx="1" fill="currentColor" stroke="none"/>
      </svg>
    </div>
  </div>
);

// ─── HomeIndicator ────────────────────────────────────────────────────────────
export const HomeIndicator: React.FC = () => (
  <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <div style={{ width: 134, height: 5, background: C.text, borderRadius: 3, opacity: 0.18 }} />
  </div>
);

// ─── NavBar ───────────────────────────────────────────────────────────────────
interface NavBarProps {
  title?: string;
  onBack?: () => void;
  backLabel?: string;
  actionLabel?: string;
  right?: React.ReactNode;
}

export const NavBar: React.FC<NavBarProps> = ({ title, onBack, backLabel = 'Back', actionLabel = 'HUE', right }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 24px 8px', flexShrink: 0,
  }}>
    <div style={{ width: 72 }}>
      {onBack && (
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 15,
          color: C.textSec, cursor: 'pointer', background: 'none', border: 'none',
          fontFamily: F.sans, padding: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          {backLabel}
        </button>
      )}
    </div>
    {title && (
      <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px', color: C.text, fontFamily: F.sans }}>
        {title}
      </span>
    )}
    <div style={{ width: 72, display: 'flex', justifyContent: 'flex-end' }}>
      {right ?? (
        <span style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 700, letterSpacing: 1, color: C.blue }}>
          {actionLabel}
        </span>
      )}
    </div>
  </div>
);

// ─── Label ────────────────────────────────────────────────────────────────────
export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <p style={{
    fontFamily: F.mono, fontSize: 10, fontWeight: 700,
    letterSpacing: '1.2px', textTransform: 'uppercase', color: C.textMuted, ...style,
  }}>{children}</p>
);

// ─── Chip ─────────────────────────────────────────────────────────────────────
export const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '5px 12px',
    border: '1px solid #7c3aed22', background: '#7c3aed0a',
    color: C.purple, fontSize: 13, fontWeight: 500, borderRadius: 4, letterSpacing: '0.2px',
  }}>{children}</span>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }> = ({ children, style, className }) => (
  <div className={className} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, ...style }}>
    {children}
  </div>
);

// ─── BtnPrimary ───────────────────────────────────────────────────────────────
export const BtnPrimary: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}> = ({ children, onClick, disabled, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: '100%', padding: '16px', background: C.blue, color: '#fff', border: 'none',
    borderRadius: 10, fontFamily: F.sans, fontSize: 16, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer', letterSpacing: '-0.2px',
    opacity: disabled ? 0.35 : 1, transition: 'background 0.15s', ...style,
  }}>{children}</button>
);

// ─── BtnSecondary ─────────────────────────────────────────────────────────────
export const BtnSecondary: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ children, onClick, style }) => (
  <button onClick={onClick} style={{
    width: '100%', padding: '16px', background: 'transparent', color: C.blue,
    border: `1px solid ${C.blue}22`, borderRadius: 10, fontFamily: F.sans,
    fontSize: 16, fontWeight: 500, cursor: 'pointer', letterSpacing: '-0.2px',
    transition: 'background 0.15s', ...style,
  }}>{children}</button>
);

// ─── StatRow ──────────────────────────────────────────────────────────────────
export const StatRow: React.FC<{
  label: string;
  value: React.ReactNode;
  border?: boolean;
}> = ({ label, value, border = true }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', borderTop: border ? `1px solid ${C.divider}` : 'none',
  }}>
    <span style={{ fontSize: 14, color: C.textSec }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: F.mono, color: C.text }}>{value}</span>
  </div>
);
