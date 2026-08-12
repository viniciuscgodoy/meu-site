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
          background: #ECE9F3;
          border-radius: 6px;
        }
      `}</style>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid rgba(17,17,17,0.06)',
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
