import Link from 'next/link'

type LinkCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  external?: boolean
  badge?: string
  delay?: number
}

export default function LinkCard({ icon, title, description, href, external, badge, delay = 0 }: LinkCardProps) {
  const Tag = external ? 'a' : Link

  const extraProps = external
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }

  return (
    <Tag
      {...(extraProps as any)}
      className="link-card fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#ffffff', fontSize: 14, fontWeight: 600 }}>{title}</span>
          {badge && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#a78bfa',
              background: 'rgba(124,58,237,0.2)',
              border: '0.5px solid rgba(124,58,237,0.4)',
              borderRadius: 6,
              padding: '2px 6px',
            }}>
              {badge}
            </span>
          )}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 2 }}>{description}</p>
      </div>

      <span className="link-card-arrow" style={{ fontSize: 14, flexShrink: 0 }}>→</span>
    </Tag>
  )
}
