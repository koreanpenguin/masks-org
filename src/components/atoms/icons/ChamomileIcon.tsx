interface IconProps { size?: number; className?: string }

export function ChamomileIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* stem */}
      <path d="M50 90 Q48 75 50 62" stroke="#5bba6a" strokeWidth="4" strokeLinecap="round" />
      {/* leaves on stem */}
      <path d="M50 80 Q38 74 34 68 Q44 70 50 80Z" fill="#5bba6a" />
      <path d="M50 72 Q62 66 66 60 Q56 64 50 72Z" fill="#4caa5a" />
      {/* petals — 8 petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx={50 + 26 * Math.sin((angle * Math.PI) / 180)}
          cy={48 + 26 * Math.cos((angle * Math.PI) / 180)}
          rx="9"
          ry="14"
          fill="white"
          transform={`rotate(${angle} ${50 + 26 * Math.sin((angle * Math.PI) / 180)} ${48 + 26 * Math.cos((angle * Math.PI) / 180)})`}
          opacity="0.95"
        />
      ))}
      {/* petal outlines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={`o${i}`}
          cx={50 + 26 * Math.sin((angle * Math.PI) / 180)}
          cy={48 + 26 * Math.cos((angle * Math.PI) / 180)}
          rx="9"
          ry="14"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="0.8"
          transform={`rotate(${angle} ${50 + 26 * Math.sin((angle * Math.PI) / 180)} ${48 + 26 * Math.cos((angle * Math.PI) / 180)})`}
        />
      ))}
      {/* yellow center */}
      <circle cx="50" cy="48" r="18" fill="url(#chamomileGrad)" />
      {/* face */}
      <circle cx="43" cy="44" r="4" fill="#2d2926" />
      <circle cx="57" cy="44" r="4" fill="#2d2926" />
      <circle cx="44.8" cy="42.2" r="1.5" fill="white" />
      <circle cx="58.8" cy="42.2" r="1.5" fill="white" />
      <path d="M43 55 Q50 61 57 55" stroke="#2d2926" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="36" cy="53" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="64" cy="53" rx="5" ry="3" fill="#ff9eb5" opacity="0.5" />
      {/* tiny dots on center */}
      <circle cx="44" cy="48" r="1.5" fill="#f9a825" opacity="0.5" />
      <circle cx="56" cy="48" r="1.5" fill="#f9a825" opacity="0.5" />
      <circle cx="50" cy="52" r="1.5" fill="#f9a825" opacity="0.5" />
      <defs>
        <radialGradient id="chamomileGrad" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="55%" stopColor="#ffee58" />
          <stop offset="100%" stopColor="#f9a825" />
        </radialGradient>
      </defs>
    </svg>
  );
}
