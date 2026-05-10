export default function SuperAgentIllustration() {
  return (
    <svg
      viewBox="0 0 220 160"
      className="w-44 md:w-56 h-auto shrink-0"
      role="img"
      aria-label="Illustration SuperAgent"
    >
      <defs>
        <linearGradient id="cape" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1E63B5" />
          <stop offset="100%" stopColor="#0B1D3A" />
        </linearGradient>
      </defs>
      <path
        d="M30 130 Q60 70 110 80 Q160 70 190 130 Z"
        fill="url(#cape)"
        opacity="0.85"
      />
      <circle cx="80" cy="65" r="18" fill="#F4E4A6" />
      <rect x="62" y="80" width="36" height="56" rx="6" fill="#1E63B5" />
      <path d="M70 110 L80 92 L90 110 Z" fill="#D4AF37" opacity="0.9" />
      <circle cx="140" cy="60" r="18" fill="#1A1F2B" />
      <rect x="122" y="76" width="36" height="60" rx="6" fill="#D4AF37" />
      <path d="M130 110 L140 88 L150 110 Z" fill="#0B1D3A" opacity="0.9" />
      <g fill="#D4AF37">
        <path d="M60 30 l2 5 5 0 -4 3 1.5 5 -4.5 -3 -4.5 3 1.5 -5 -4 -3 5 0 z" />
        <path d="M170 30 l2 5 5 0 -4 3 1.5 5 -4.5 -3 -4.5 3 1.5 -5 -4 -3 5 0 z" />
      </g>
    </svg>
  );
}
