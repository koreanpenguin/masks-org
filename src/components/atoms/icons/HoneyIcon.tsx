interface IconProps { size?: number; className?: string }

export function HoneyIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* honey drips on top */}
      <path d="M36 30 Q36 24 38 28 Q36 32 36 30Z" fill="#f9a825" />
      <path d="M50 26 Q50 19 52 24 Q50 28 50 26Z" fill="#fbc02d" />
      <path d="M63 30 Q63 23 65 27 Q63 32 63 30Z" fill="#f9a825" />
      {/* lid */}
      <rect x="28" y="28" width="44" height="10" rx="5" fill="#5d4037" />
      <rect x="32" y="24" width="36" height="8" rx="4" fill="#795548" />
      <circle cx="50" cy="22" r="5" fill="#6d4c41" />
      <circle cx="50" cy="20" r="3" fill="#8d6e63" />
      {/* honey jar body */}
      <path d="M28 38 Q22 50 24 68 Q26 84 50 84 Q74 84 76 68 Q78 50 72 38 Z" fill="url(#honeyGrad)" />
      {/* jar bands */}
      <path d="M26 55 Q50 60 74 55" stroke="#f9a825" strokeWidth="2.5" fill="none" opacity="0.5" />
      <path d="M25 65 Q50 70 75 65" stroke="#f9a825" strokeWidth="2" fill="none" opacity="0.4" />
      {/* honey drip down side */}
      <path d="M68 38 Q72 48 70 55 Q72 48 74 42" fill="#fbc02d" opacity="0.6" />
      {/* face */}
      <circle cx="41" cy="58" r="4.5" fill="#2d2926" />
      <circle cx="59" cy="58" r="4.5" fill="#2d2926" />
      <circle cx="42.8" cy="56.2" r="1.7" fill="white" />
      <circle cx="60.8" cy="56.2" r="1.7" fill="white" />
      <path d="M41 69 Q50 76 59 69" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="33" cy="67" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="67" cy="67" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      {/* honeycomb dots */}
      <circle cx="18" cy="48" r="3" fill="#fbc02d" opacity="0.5" />
      <circle cx="82" cy="44" r="2.5" fill="#f9a825" opacity="0.5" />
      <circle cx="16" cy="62" r="2" fill="#fbc02d" opacity="0.4" />
      {/* shine */}
      <ellipse cx="36" cy="46" rx="8" ry="5" fill="white" opacity="0.25" transform="rotate(-20 36 46)" />
      <defs>
        <radialGradient id="honeyGrad" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffe082" />
          <stop offset="55%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#e65100" stopOpacity="0.7" />
        </radialGradient>
      </defs>
    </svg>
  );
}
