interface IconProps { className?: string; size?: number }

export function EcoIcon({ className = "", size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* box body */}
      <rect x="8" y="18" width="24" height="16" rx="3" fill="#7a8c5a" opacity="0.3" />
      <rect x="8" y="18" width="24" height="16" rx="3" stroke="#7a8c5a" strokeWidth="1.5" />
      {/* box lid */}
      <rect x="6" y="14" width="28" height="5" rx="2" fill="#7a8c5a" opacity="0.5" />
      <rect x="6" y="14" width="28" height="5" rx="2" stroke="#7a8c5a" strokeWidth="1.5" />
      {/* ribbon */}
      <rect x="18" y="14" width="4" height="20" fill="#c17a5a" opacity="0.4" />
      <path d="M20 14 L14 8 Q12 6 14 5 L20 10 L26 5 Q28 6 26 8 Z" fill="#c17a5a" opacity="0.6" />
      {/* tiny leaf on box */}
      <path d="M11 26 Q14 22 18 24 Q14 26 11 26Z" fill="#7a8c5a" opacity="0.7" />
      {/* dots */}
      <circle cx="30" cy="10" r="1.5" fill="#c17a5a" opacity="0.5" />
      <circle cx="10" cy="9" r="1" fill="#7a8c5a" opacity="0.5" />
    </svg>
  );
}
