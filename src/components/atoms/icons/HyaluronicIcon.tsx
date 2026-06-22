interface IconProps { size?: number; className?: string }

export function HyaluronicIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* orbiting small bubbles */}
      <circle cx="16" cy="45" r="7" fill="#90caf9" opacity="0.7" />
      <circle cx="84" cy="40" r="5.5" fill="#90caf9" opacity="0.6" />
      <circle cx="20" cy="78" r="6" fill="#bbdefb" opacity="0.65" />
      <circle cx="82" cy="75" r="8" fill="#90caf9" opacity="0.55" />
      <circle cx="50" cy="16" r="5" fill="#bbdefb" opacity="0.65" />
      <circle cx="28" cy="28" r="4" fill="#bbdefb" opacity="0.5" />
      <circle cx="74" cy="24" r="3" fill="#90caf9" opacity="0.5" />
      {/* connector lines */}
      <line x1="23" y1="47" x2="36" y2="55" stroke="#64b5f6" strokeWidth="1.2" opacity="0.4" />
      <line x1="78" y1="43" x2="65" y2="52" stroke="#64b5f6" strokeWidth="1.2" opacity="0.4" />
      <line x1="26" y1="75" x2="37" y2="68" stroke="#64b5f6" strokeWidth="1.2" opacity="0.4" />
      <line x1="74" y1="73" x2="64" y2="66" stroke="#64b5f6" strokeWidth="1.2" opacity="0.4" />
      {/* main water bubble */}
      <circle cx="50" cy="62" r="30" fill="url(#haGrad)" />
      <circle cx="50" cy="62" r="30" fill="url(#haShine)" />
      {/* face */}
      <circle cx="41" cy="57" r="4.5" fill="#2d2926" />
      <circle cx="59" cy="57" r="4.5" fill="#2d2926" />
      <circle cx="42.8" cy="55.2" r="1.7" fill="white" />
      <circle cx="60.8" cy="55.2" r="1.7" fill="white" />
      {/* happy smile */}
      <path d="M41 68 Q50 76 59 68" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="33" cy="66" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="67" cy="66" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      {/* water drop shapes inside */}
      <path d="M50 38 Q50 32 54 36 Q50 42 50 38Z" fill="white" opacity="0.25" />
      {/* shine */}
      <ellipse cx="38" cy="47" rx="9" ry="5.5" fill="white" opacity="0.3" transform="rotate(-25 38 47)" />
      <defs>
        <radialGradient id="haGrad" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#c8e6fc" />
          <stop offset="55%" stopColor="#64b5f6" />
          <stop offset="100%" stopColor="#2196f3" />
        </radialGradient>
        <radialGradient id="haShine" cx="30%" cy="25%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
