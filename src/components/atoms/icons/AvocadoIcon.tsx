interface IconProps { size?: number; className?: string }

export function AvocadoIcon({ size = 100, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* avocado slices in background */}
      <ellipse cx="16" cy="55" rx="9" ry="12" fill="#8bc34a" opacity="0.5" transform="rotate(-15 16 55)" />
      <ellipse cx="16" cy="55" rx="6" ry="8" fill="#c5e1a5" opacity="0.5" transform="rotate(-15 16 55)" />
      <ellipse cx="84" cy="50" rx="8" ry="11" fill="#8bc34a" opacity="0.4" transform="rotate(15 84 50)" />
      <ellipse cx="84" cy="50" rx="5" ry="7" fill="#c5e1a5" opacity="0.4" transform="rotate(15 84 50)" />
      {/* outer avocado skin */}
      <path d="M50 18 Q28 24 24 52 Q22 74 50 86 Q78 74 76 52 Q72 24 50 18Z" fill="#33691e" />
      <path d="M50 22 Q30 28 28 54 Q26 74 50 84 Q74 74 72 54 Q70 28 50 22Z" fill="#558b2f" />
      {/* inner flesh */}
      <path d="M50 26 Q34 32 32 56 Q30 74 50 82 Q70 74 68 56 Q66 32 50 26Z" fill="#c5e1a5" />
      {/* pit */}
      <ellipse cx="50" cy="60" rx="14" ry="16" fill="#795548" />
      <ellipse cx="50" cy="60" rx="12" ry="14" fill="#8d6e63" />
      <ellipse cx="50" cy="58" rx="9" ry="11" fill="#6d4c41" />
      {/* face on pit */}
      <circle cx="44" cy="56" r="4" fill="#2d2926" />
      <circle cx="56" cy="56" r="4" fill="#2d2926" />
      <circle cx="45.5" cy="54.5" r="1.5" fill="white" />
      <circle cx="57.5" cy="54.5" r="1.5" fill="white" />
      <path d="M44 65 Q50 70 56 65" stroke="#2d2926" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* rosy cheeks */}
      <ellipse cx="37" cy="63" rx="4" ry="2.5" fill="#ff9eb5" opacity="0.5" />
      <ellipse cx="63" cy="63" rx="4" ry="2.5" fill="#ff9eb5" opacity="0.5" />
      {/* shine on skin */}
      <ellipse cx="38" cy="34" rx="7" ry="4" fill="white" opacity="0.15" transform="rotate(-20 38 34)" />
    </svg>
  );
}
