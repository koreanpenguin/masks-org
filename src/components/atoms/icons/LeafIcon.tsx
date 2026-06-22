interface IconProps { className?: string; size?: number }

export function LeafIcon({ className = "", size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* leaf body */}
      <path d="M20 36 C20 36 6 28 6 16 C6 8 13 4 20 4 C27 4 34 8 34 16 C34 28 20 36 20 36Z" fill="#7a8c5a" opacity="0.2" />
      <path d="M20 36 C20 36 6 28 6 16 C6 8 13 4 20 4 C27 4 34 8 34 16 C34 28 20 36 20 36Z" fill="#7a8c5a" opacity="0.6" />
      {/* center vein */}
      <path d="M20 8 Q20 22 20 36" stroke="#faf6f1" strokeWidth="1.5" strokeLinecap="round" />
      {/* side veins */}
      <path d="M20 14 Q14 16 11 20" stroke="#faf6f1" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M20 14 Q26 16 29 20" stroke="#faf6f1" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <path d="M20 20 Q15 22 13 26" stroke="#faf6f1" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M20 20 Q25 22 27 26" stroke="#faf6f1" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      {/* tiny sparkle */}
      <circle cx="30" cy="10" r="1.5" fill="#c17a5a" opacity="0.6" />
    </svg>
  );
}
