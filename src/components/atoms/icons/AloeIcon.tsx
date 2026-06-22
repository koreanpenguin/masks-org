interface IconProps { size?: number; className?: string }

export function AloeIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* main aloe leaf body */}
      <ellipse cx="50" cy="60" rx="22" ry="32" fill="#5bba8a" />
      <ellipse cx="50" cy="60" rx="17" ry="27" fill="#78d4a4" />
      {/* white dots on leaf */}
      <ellipse cx="44" cy="50" rx="3" ry="2" fill="white" opacity="0.7" />
      <ellipse cx="56" cy="55" rx="3" ry="2" fill="white" opacity="0.7" />
      <ellipse cx="46" cy="65" rx="2.5" ry="1.8" fill="white" opacity="0.7" />
      <ellipse cx="55" cy="70" rx="2" ry="1.5" fill="white" opacity="0.6" />
      {/* left side leaf */}
      <ellipse cx="30" cy="65" rx="10" ry="20" fill="#5bba8a" transform="rotate(-20 30 65)" />
      <ellipse cx="30" cy="65" rx="7" ry="15" fill="#78d4a4" transform="rotate(-20 30 65)" />
      {/* right side leaf */}
      <ellipse cx="70" cy="65" rx="10" ry="20" fill="#5bba8a" transform="rotate(20 70 65)" />
      <ellipse cx="70" cy="65" rx="7" ry="15" fill="#78d4a4" transform="rotate(20 70 65)" />
      {/* face on main leaf */}
      <circle cx="44" cy="58" r="4" fill="#2d2926" />
      <circle cx="56" cy="58" r="4" fill="#2d2926" />
      <circle cx="45.5" cy="56.5" r="1.5" fill="white" />
      <circle cx="57.5" cy="56.5" r="1.5" fill="white" />
      {/* smile */}
      <path d="M44 65 Q50 70 56 65" stroke="#2d2926" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="38" cy="64" rx="4" ry="2.5" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="62" cy="64" rx="4" ry="2.5" fill="#ff9eb5" opacity="0.5" />
      {/* water drops */}
      <path d="M20 30 Q20 25 23 28 Q20 32 20 30Z" fill="#a8e6d0" opacity="0.8" />
      <path d="M78 40 Q78 35 81 38 Q78 42 78 40Z" fill="#a8e6d0" opacity="0.8" />
      <path d="M15 50 Q15 46 17.5 48.5 Q15 52 15 50Z" fill="#a8e6d0" opacity="0.6" />
    </svg>
  );
}
