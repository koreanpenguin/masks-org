interface IconProps { size?: number; className?: string }

export function SeaweedIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* back tentacles */}
      <path d="M50 72 Q30 75 22 88 Q28 90 35 80 Q40 92 48 85" stroke="#4caa5a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M50 72 Q70 75 78 88 Q72 90 65 80 Q60 92 52 85" stroke="#4caa5a" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* front tentacles */}
      <path d="M50 72 Q28 70 18 78 Q22 84 30 76 Q32 86 40 80" stroke="#6dbf6e" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M50 72 Q72 70 82 78 Q78 84 70 76 Q68 86 60 80" stroke="#6dbf6e" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* main body */}
      <circle cx="50" cy="55" r="28" fill="#4caa5a" />
      <circle cx="50" cy="55" r="28" fill="url(#seaweedGrad)" />
      {/* face */}
      <circle cx="41" cy="50" r="4.5" fill="#2d2926" />
      <circle cx="59" cy="50" r="4.5" fill="#2d2926" />
      <circle cx="42.8" cy="48.2" r="1.7" fill="white" />
      <circle cx="60.8" cy="48.2" r="1.7" fill="white" />
      {/* smile */}
      <path d="M41 61 Q50 68 59 61" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="33" cy="59" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="67" cy="59" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      {/* bubbles */}
      <circle cx="20" cy="38" r="4" fill="#a8ddb0" opacity="0.7" />
      <circle cx="80" cy="42" r="3" fill="#a8ddb0" opacity="0.6" />
      <circle cx="15" cy="52" r="2.5" fill="#a8ddb0" opacity="0.5" />
      <circle cx="84" cy="58" r="2" fill="#a8ddb0" opacity="0.5" />
      {/* shine */}
      <ellipse cx="38" cy="41" rx="8" ry="5" fill="white" opacity="0.25" transform="rotate(-20 38 41)" />
      <defs>
        <radialGradient id="seaweedGrad" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#82d48a" />
          <stop offset="60%" stopColor="#4caa5a" />
          <stop offset="100%" stopColor="#2d8a3a" />
        </radialGradient>
      </defs>
    </svg>
  );
}
