interface IconProps { className?: string; size?: number }

export function TruckIcon({ className = "", size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* truck body */}
      <rect x="4" y="16" width="22" height="14" rx="3" fill="#c17a5a" opacity="0.25" />
      <rect x="4" y="16" width="22" height="14" rx="3" stroke="#c17a5a" strokeWidth="1.5" />
      {/* cab */}
      <path d="M26 20 L34 20 L36 26 L36 30 L26 30 Z" fill="#c17a5a" opacity="0.4" stroke="#c17a5a" strokeWidth="1.5" strokeLinejoin="round" />
      {/* window */}
      <rect x="27" y="21" width="6" height="5" rx="1.5" fill="#faf6f1" opacity="0.8" />
      {/* wheels */}
      <circle cx="11" cy="31" r="4" fill="#6b4f3a" opacity="0.5" />
      <circle cx="11" cy="31" r="2" fill="#e8ddd0" />
      <circle cx="29" cy="31" r="4" fill="#6b4f3a" opacity="0.5" />
      <circle cx="29" cy="31" r="2" fill="#e8ddd0" />
      {/* speed lines */}
      <path d="M4 22 L1 22" stroke="#7a8c5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 25 L0 25" stroke="#7a8c5a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 28 L2 28" stroke="#7a8c5a" strokeWidth="1.5" strokeLinecap="round" />
      {/* heart on body */}
      <path d="M13 22 Q13 20 15 20 Q17 20 17 22 Q17 24 15 26 Q13 24 13 22Z" fill="#c17a5a" opacity="0.4" />
    </svg>
  );
}
