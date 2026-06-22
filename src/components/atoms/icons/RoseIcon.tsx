interface IconProps { size?: number; className?: string }

export function RoseIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* stem */}
      <path d="M50 95 Q46 80 50 65" stroke="#5bba6a" strokeWidth="4" strokeLinecap="round" />
      {/* leaves */}
      <path d="M50 82 Q36 76 30 68 Q42 72 50 82Z" fill="#5bba6a" />
      <path d="M50 76 Q64 70 70 62 Q58 68 50 76Z" fill="#4caa5a" />
      {/* outer petals */}
      <ellipse cx="50" cy="38" rx="22" ry="20" fill="#f48fb1" />
      <path d="M30 45 Q28 28 38 22 Q48 16 50 26" fill="#f48fb1" />
      <path d="M70 45 Q72 28 62 22 Q52 16 50 26" fill="#f48fb1" />
      <path d="M32 55 Q20 50 22 38 Q30 28 38 38" fill="#f06292" />
      <path d="M68 55 Q80 50 78 38 Q70 28 62 38" fill="#f06292" />
      {/* mid petals */}
      <ellipse cx="50" cy="44" rx="18" ry="16" fill="#f8bbd0" />
      <path d="M34 44 Q34 30 42 26 Q50 22 50 34" fill="#f8bbd0" />
      <path d="M66 44 Q66 30 58 26 Q50 22 50 34" fill="#f8bbd0" />
      {/* inner petals */}
      <ellipse cx="50" cy="48" rx="13" ry="12" fill="#f48fb1" />
      <path d="M38 48 Q38 36 44 34 Q50 32 50 42" fill="#f48fb1" />
      <path d="M62 48 Q62 36 56 34 Q50 32 50 42" fill="#f06292" />
      {/* center */}
      <circle cx="50" cy="50" r="9" fill="#e91e8c" opacity="0.4" />
      <circle cx="50" cy="50" r="7" fill="#ad1457" opacity="0.3" />
      {/* face on rose */}
      <circle cx="44" cy="48" r="3.5" fill="#2d2926" />
      <circle cx="56" cy="48" r="3.5" fill="#2d2926" />
      <circle cx="45.4" cy="46.6" r="1.3" fill="white" />
      <circle cx="57.4" cy="46.6" r="1.3" fill="white" />
      <path d="M44 57 Q50 62 56 57" stroke="#2d2926" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="37" cy="55" rx="4" ry="2.5" fill="#ff4081" opacity="0.35" />
      <ellipse cx="63" cy="55" rx="4" ry="2.5" fill="#ff4081" opacity="0.35" />
      {/* sparkles */}
      <circle cx="20" cy="36" r="2.5" fill="#f8bbd0" opacity="0.8" />
      <circle cx="80" cy="32" r="2" fill="#f8bbd0" opacity="0.7" />
      <circle cx="16" cy="50" r="1.5" fill="#f48fb1" opacity="0.6" />
    </svg>
  );
}
