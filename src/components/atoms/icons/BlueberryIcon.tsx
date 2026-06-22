interface IconProps { size?: number; className?: string }

export function BlueberryIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* leaves */}
      <path d="M50 28 Q38 18 28 22 Q32 32 44 30 Z" fill="#5bba6a" />
      <path d="M50 28 Q62 18 72 22 Q68 32 56 30 Z" fill="#4caa5a" />
      <path d="M50 28 Q42 14 36 12 Q36 22 46 26 Z" fill="#6dbf6e" />
      {/* stem */}
      <path d="M50 32 L50 26" stroke="#4caa5a" strokeWidth="2.5" strokeLinecap="round" />
      {/* star/crown on top */}
      <path d="M50 32 L48 28 L50 30 L52 28 Z" fill="#3a9a4a" />
      {/* main blueberry body */}
      <circle cx="50" cy="65" r="30" fill="#4a58a8" />
      <circle cx="50" cy="65" r="30" fill="url(#blueberryGrad)" />
      {/* white dots pattern */}
      <circle cx="38" cy="55" r="3" fill="white" opacity="0.2" />
      <circle cx="62" cy="58" r="2.5" fill="white" opacity="0.2" />
      <circle cx="45" cy="75" r="2" fill="white" opacity="0.2" />
      <circle cx="60" cy="72" r="3" fill="white" opacity="0.2" />
      {/* face */}
      <circle cx="41" cy="60" r="4.5" fill="#2d2926" />
      <circle cx="59" cy="60" r="4.5" fill="#2d2926" />
      <circle cx="42.8" cy="58.2" r="1.7" fill="white" />
      <circle cx="60.8" cy="58.2" r="1.7" fill="white" />
      {/* smile */}
      <path d="M41 71 Q50 78 59 71" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="33" cy="69" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="67" cy="69" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      {/* shine */}
      <ellipse cx="38" cy="50" rx="9" ry="5.5" fill="white" opacity="0.25" transform="rotate(-25 38 50)" />
      <defs>
        <radialGradient id="blueberryGrad" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#7080c8" />
          <stop offset="55%" stopColor="#4a58a8" />
          <stop offset="100%" stopColor="#2e3a88" />
        </radialGradient>
      </defs>
    </svg>
  );
}
