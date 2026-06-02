export default function ProductSkeleton() {
  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.6; }
        }
        .skeleton-pulse {
          animation: skeletonPulse 1.5s ease-in-out infinite;
          background: rgba(124,58,237,0.15);
          border-radius: 6px;
        }
      `}</style>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(150,100,255,0.18)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Imagem */}
        <div className="skeleton-pulse skeleton-img" style={{ flexShrink: 0 }} />
        {/* Corpo */}
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div className="skeleton-pulse" style={{ height: 13, width: '90%' }} />
          <div className="skeleton-pulse" style={{ height: 13, width: '65%' }} />
          <div className="skeleton-pulse" style={{ height: 22, width: 80, borderRadius: 20, marginTop: 2 }} />
          <div className="skeleton-pulse" style={{ height: 34, borderRadius: 8, marginTop: 'auto' }} />
        </div>
      </div>
    </>
  )
}
