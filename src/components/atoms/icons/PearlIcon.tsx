interface IconProps { size?: number; className?: string }

export function PearlIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* oyster shell bottom */}
      <ellipse cx="50" cy="80" rx="36" ry="16" fill="#b8cdd6" />
      <ellipse cx="50" cy="78" rx="34" ry="14" fill="#cfe0e8" />
      {/* oyster shell ridges */}
      <path d="M20 76 Q35 68 50 76 Q65 68 80 76" stroke="#a8c4ce" strokeWidth="1.5" fill="none" />
      <path d="M25 80 Q37 73 50 80 Q63 73 75 80" stroke="#a8c4ce" strokeWidth="1" fill="none" />
      {/* oyster shell top flap */}
      <ellipse cx="50" cy="72" rx="36" ry="12" fill="#b8cdd6" transform="rotate(-10 50 72)" />
      <ellipse cx="50" cy="71" rx="33" ry="10" fill="#d8eaf0" transform="rotate(-10 50 72)" />
      {/* pearl */}
      <circle cx="50" cy="68" r="22" fill="url(#pearlGrad)" />
      <circle cx="50" cy="68" r="22" fill="url(#pearlShine)" />
      {/* pearl face */}
      <circle cx="43" cy="64" r="4" fill="#2d2926" />
      <circle cx="57" cy="64" r="4" fill="#2d2926" />
      <circle cx="44.5" cy="62.5" r="1.5" fill="white" />
      <circle cx="58.5" cy="62.5" r="1.5" fill="white" />
      {/* smile */}
      <path d="M43 72 Q50 78 57 72" stroke="#2d2926" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="36" cy="70" rx="4" ry="2.5" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="64" cy="70" rx="4" ry="2.5" fill="#ff9eb5" opacity="0.5" />
      {/* sparkles */}
      <circle cx="78" cy="42" r="2.5" fill="#f8e8f0" opacity="0.9" />
      <circle cx="84" cy="50" r="1.5" fill="#f0c8dc" opacity="0.8" />
      <circle cx="20" cy="48" r="2" fill="#f8e8f0" opacity="0.8" />
      {/* shell hinge dots */}
      <circle cx="50" cy="58" r="2" fill="#a8c4ce" />
      <defs>
        <radialGradient id="pearlGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f8f4ff" />
          <stop offset="50%" stopColor="#e8e0f0" />
          <stop offset="100%" stopColor="#c8bcd8" />
        </radialGradient>
        <radialGradient id="pearlShine" cx="30%" cy="25%" r="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
