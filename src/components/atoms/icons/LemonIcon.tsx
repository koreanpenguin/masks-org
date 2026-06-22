interface IconProps { size?: number; className?: string }

export function LemonIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* leaf */}
      <path d="M58 22 Q70 10 78 14 Q72 26 60 26 Z" fill="#5bba6a" />
      <path d="M58 22 Q62 10 68 10 Q66 22 60 26 Z" fill="#4caa5a" />
      <path d="M58 22 L60 26" stroke="#3a9a4a" strokeWidth="2" strokeLinecap="round" />
      {/* lemon slice bottom right */}
      <circle cx="78" cy="82" r="12" fill="#ffe066" opacity="0.5" />
      <circle cx="78" cy="82" r="10" fill="#fff176" opacity="0.7" />
      <path d="M78 72 L78 92 M68 82 L88 82 M70 74 L86 90 M86 74 L70 90" stroke="#fbc02d" strokeWidth="0.8" opacity="0.6" />
      {/* main lemon body */}
      <ellipse cx="48" cy="64" rx="30" ry="28" fill="url(#lemonGrad)" />
      {/* lemon tip */}
      <ellipse cx="78" cy="60" rx="7" ry="5" fill="#ffe066" transform="rotate(-20 78 60)" />
      <ellipse cx="18" cy="68" rx="6" ry="4" fill="#ffe066" transform="rotate(20 18 68)" />
      {/* face */}
      <circle cx="40" cy="60" r="4.5" fill="#2d2926" />
      <circle cx="56" cy="60" r="4.5" fill="#2d2926" />
      <circle cx="41.8" cy="58.2" r="1.7" fill="white" />
      <circle cx="57.8" cy="58.2" r="1.7" fill="white" />
      <path d="M40 71 Q48 78 56 71" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="32" cy="69" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="64" cy="69" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      {/* sparkles */}
      <circle cx="20" cy="38" r="2.5" fill="#ffe066" opacity="0.8" />
      <circle cx="14" cy="48" r="1.5" fill="#fbc02d" opacity="0.6" />
      {/* shine */}
      <ellipse cx="35" cy="48" rx="9" ry="5" fill="white" opacity="0.3" transform="rotate(-25 35 48)" />
      <defs>
        <radialGradient id="lemonGrad" cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="50%" stopColor="#ffee58" />
          <stop offset="100%" stopColor="#fbc02d" />
        </radialGradient>
      </defs>
    </svg>
  );
}
