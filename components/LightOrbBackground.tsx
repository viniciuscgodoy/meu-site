import { lightTheme } from '@/lib/tokens'

export default function LightOrbBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      background: lightTheme.bg,
      pointerEvents: 'none',
    }}>
      {/* Orb roxo — top-left */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${lightTheme.orbPurple}, transparent 70%)`,
      }} />

      {/* Orb azul — bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${lightTheme.orbBlue}, transparent 70%)`,
      }} />

      {/* Orb lilás — center-right */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '-50px',
        transform: 'translateY(-50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${lightTheme.orbLilac}, transparent 70%)`,
      }} />
    </div>
  )
}
