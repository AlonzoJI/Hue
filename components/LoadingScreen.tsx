import React from 'react';
import { C, F } from './IOSFrame';

const LoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100%', background: '#080810', gap: 0,
  }}>
    {/* Ambient orb */}
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div className="orb1" style={{ position: 'absolute', top: '30%', left: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #2563eb30 0%, transparent 70%)' }} />
      <div className="orb2" style={{ position: 'absolute', bottom: '25%', right: '15%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, #7c3aed28 0%, transparent 70%)' }} />
    </div>

    {/* Spinning logo */}
    <div style={{ position: 'relative', marginBottom: 32 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ position: 'absolute', top: -4, left: -4, animation: 'spin 2s linear infinite' }}>
        <circle cx="36" cy="36" r="34" fill="none" stroke="url(#lg)" strokeWidth="2" strokeDasharray="40 174" strokeLinecap="round" />
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.blue} /><stop offset="100%" stopColor={C.purple} />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: 'linear-gradient(135deg, #2563EB, #7c3aed)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: F.mono, fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>H</span>
      </div>
    </div>

    <p style={{ fontFamily: F.mono, fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: 2 }}>HUE</p>
    <p style={{ fontSize: 13, color: '#ffffff50', marginTop: 10, letterSpacing: 0.5, animation: 'wave2 1.8s ease-in-out infinite' }}>
      Analyzing your speech…
    </p>
  </div>
);

export default LoadingScreen;
