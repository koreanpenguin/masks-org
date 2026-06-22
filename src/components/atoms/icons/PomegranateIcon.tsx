interface IconProps { size?: number; className?: string }

export function PomegranateIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* crown / calyx on top */}
      <path d="M38 30 L36 20 L42 28 L44 16 L48 26 L50 14 L52 26 L56 16 L58 28 L64 20 L62 30 Z" fill="#c62828" />
      <path d="M40 30 L38 22 L43 29 L45 18 L49 27 L50 16 L51 27 L55 18 L57 29 L62 22 L60 30 Z" fill="#e53935" />
      {/* stem */}
      <rect x="48" y="12" width="4" height="8" rx="2" fill="#5d4037" />
      {/* main body */}
      <circle cx="50" cy="65" r="32" fill="url(#pomGrad)" />
      {/* seed dots scattered around */}
      <circle cx="20" cy="58" r="4" fill="#ef9a9a" opacity="0.7" />
      <circle cx="80" cy="52" r="3.5" fill="#ef9a9a" opacity="0.6" />
      <circle cx="22" cy="76" r="3" fill="#ef9a9a" opacity="0.6" />
      <circle cx="78" cy="74" r="4.5" fill="#ef9a9a" opacity="0.55" />
      <circle cx="50" cy="102" r="3" fill="#ef9a9a" opacity="0.5" />
      {/* seeds on body */}
      <ellipse cx="38" cy="72" rx="4" ry="3" fill="#ef5350" opacity="0.5" />
      <ellipse cx="62" cy="68" rx="3.5" ry="2.5" fill="#ef5350" opacity="0.5" />
      <ellipse cx="50" cy="76" rx="3" ry="2" fill="#ef5350" opacity="0.45" />
      <ellipse cx="44" cy="80" rx="2.5" ry="2" fill="#ef5350" opacity="0.4" />
      <ellipse cx="58" cy="78" rx="3" ry="2" fill="#ef5350" opacity="0.4" />
      {/* face */}
      <circle cx="41" cy="58" r="4.5" fill="#2d2926" />
      <circle cx="59" cy="58" r="4.5" fill="#2d2926" />
      <circle cx="42.8" cy="56.2" r="1.7" fill="white" />
      <circle cx="60.8" cy="56.2" r="1.7" fill="white" />
      <path d="M41 69 Q50 76 59 69" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="33" cy="67" rx="5" ry="3" fill="#ff9eb5" opacity="0.45" />
      <ellipse cx="67" cy="67" rx="5" ry="3" fill="#ff9eb5" opacity="0.45" />
      {/* shine */}
      <ellipse cx="36" cy="48" rx="9" ry="5.5" fill="white" opacity="0.25" transform="rotate(-25 36 48)" />
      <defs>
        <radialGradient id="pomGrad" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ff8a80" />
          <stop offset="50%" stopColor="#f44336" />
          <stop offset="100%" stopColor="#b71c1c" />
        </radialGradient>
      </defs>
    </svg>
  );
}
