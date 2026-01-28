
interface MetallicBorderProps {
  style: string
  color: string
  className?: string
}

// SVG-based metallic borders
export default function MetallicBorder({ style, color, className = '' }: MetallicBorderProps) {
  const getColor = () => {
    const colors: Record<string, string> = {
      gold: '#f5e882',
      yellow: '#ffd700',
      silver: '#c0c0c0',
      bronze: '#cd7f32',
      copper: '#b87333',
      pink: '#ffc0cb',
      white: '#ffffff',
    }
    return colors[color] || colors.gold
  }

  const borderColor = getColor()

  // Classic border - simple frame
  if (style === 'classic') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id={`grad-${style}-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={borderColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={borderColor} stopOpacity="1" />
            <stop offset="100%" stopColor={borderColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="none" stroke={`url(#grad-${style}-${color})`} strokeWidth="4" />
        <rect x="2" y="2" width="96" height="96" fill="none" stroke={borderColor} strokeWidth="1.5" opacity="0.7" />
      </svg>
    )
  }

  // Ornate border - decorative pattern
  if (style === 'ornate') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id={`grad-${style}-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={borderColor} stopOpacity="1" />
            <stop offset="100%" stopColor={borderColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="none" stroke={`url(#grad-${style}-${color})`} strokeWidth="4" />
        {/* Corner decorations */}
        <circle cx="5" cy="5" r="1.5" fill={borderColor} />
        <circle cx="95" cy="5" r="1.5" fill={borderColor} />
        <circle cx="5" cy="95" r="1.5" fill={borderColor} />
        <circle cx="95" cy="95" r="1.5" fill={borderColor} />
        {/* Side decorations */}
        <rect x="2" y="2" width="96" height="96" fill="none" stroke={borderColor} strokeWidth="1" strokeDasharray="2,2" opacity="0.5" />
      </svg>
    )
  }

  // Modern border - clean lines
  if (style === 'modern') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id={`grad-${style}-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={borderColor} stopOpacity="0.5" />
            <stop offset="50%" stopColor={borderColor} stopOpacity="1" />
            <stop offset="100%" stopColor={borderColor} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="none" stroke={`url(#grad-${style}-${color})`} strokeWidth="4" />
      </svg>
    )
  }

  // Elegant border - sophisticated
  if (style === 'elegant') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id={`grad-${style}-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={borderColor} stopOpacity="1" />
            <stop offset="50%" stopColor={borderColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={borderColor} stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="none" stroke={`url(#grad-${style}-${color})`} strokeWidth="4" />
        <rect x="1.5" y="1.5" width="97" height="97" fill="none" stroke={borderColor} strokeWidth="1.5" opacity="0.6" />
      </svg>
    )
  }

  // Floral border
  if (style === 'floral') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id={`grad-${style}-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={borderColor} stopOpacity="1" />
            <stop offset="100%" stopColor={borderColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="none" stroke={`url(#grad-${style}-${color})`} strokeWidth="4" />
        {/* Floral pattern elements */}
        <circle cx="10" cy="10" r="2" fill={borderColor} opacity="0.6" />
        <circle cx="90" cy="10" r="2" fill={borderColor} opacity="0.6" />
        <circle cx="10" cy="90" r="2" fill={borderColor} opacity="0.6" />
        <circle cx="90" cy="90" r="2" fill={borderColor} opacity="0.6" />
      </svg>
    )
  }

  // Geometric border
  if (style === 'geometric') {
    return (
      <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
        <defs>
          <linearGradient id={`grad-${style}-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={borderColor} stopOpacity="1" />
            <stop offset="50%" stopColor={borderColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={borderColor} stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="none" stroke={`url(#grad-${style}-${color})`} strokeWidth="4" />
        {/* Geometric pattern */}
        <polygon points="5,5 8,5 8,8 5,8" fill={borderColor} opacity="0.5" />
        <polygon points="92,5 95,5 95,8 92,8" fill={borderColor} opacity="0.5" />
        <polygon points="5,92 8,92 8,95 5,95" fill={borderColor} opacity="0.5" />
        <polygon points="92,92 95,92 95,95 92,95" fill={borderColor} opacity="0.5" />
      </svg>
    )
  }

  // Default
  return (
    <svg className={`absolute inset-0 w-full h-full ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
      <rect x="0" y="0" width="100" height="100" fill="none" stroke={borderColor} strokeWidth="4" />
    </svg>
  )
}
