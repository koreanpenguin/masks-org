interface IconProps { size?: number; className?: string }

export function CollagenIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* small orbiting bubbles */}
      <circle cx="18" cy="40" r="8" fill="#f8b4c8" opacity="0.7" />
      <circle cx="82" cy="35" r="6" fill="#f8b4c8" opacity="0.6" />
      <circle cx="22" cy="75" r="5" fill="#f8c8d8" opacity="0.6" />
      <circle cx="80" cy="72" r="7" fill="#f8b4c8" opacity="0.5" />
      <circle cx="50" cy="18" r="4" fill="#f8c8d8" opacity="0.6" />
      {/* connector lines */}
      <line x1="26" y1="40" x2="38" y2="55" stroke="#f0a0bc" strokeWidth="1.5" opacity="0.5" />
      <line x1="74" y1="38" x2="63" y2="53" stroke="#f0a0bc" strokeWidth="1.5" opacity="0.5" />
      <line x1="27" y1="72" x2="38" y2="67" stroke="#f0a0bc" strokeWidth="1.5" opacity="0.5" />
      <line x1="73" y1="70" x2="63" y2="65" stroke="#f0a0bc" strokeWidth="1.5" opacity="0.5" />
      {/* main collagen bubble */}
      <circle cx="50" cy="62" r="30" fill="url(#collagenGrad)" />
      <circle cx="50" cy="62" r="30" fill="url(#collagenShine)" />
      {/* face */}
      <circle cx="41" cy="57" r="4.5" fill="#2d2926" />
      <circle cx="59" cy="57" r="4.5" fill="#2d2926" />
      <circle cx="42.8" cy="55.2" r="1.7" fill="white" />
      <circle cx="60.8" cy="55.2" r="1.7" fill="white" />
      {/* smile */}
      <path d="M41 68 Q50 75 59 68" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="34" cy="66" rx="5" ry="3" fill="#ff6b8a" opacity="0.4" />
      <ellipse cx="66" cy="66" rx="5" ry="3" fill="#ff6b8a" opacity="0.4" />
      {/* shine on main bubble */}
      <ellipse cx="38" cy="46" rx="8" ry="5" fill="white" opacity="0.3" transform="rotate(-30 38 46)" />
      <defs>
        <radialGradient id="collagenGrad" cx="45%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#ffc8d8" />
          <stop offset="60%" stopColor="#f090b0" />
          <stop offset="100%" stopColor="#e06888" />
        </radialGradient>
        <radialGradient id="collagenShine" cx="30%" cy="25%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
