interface IconProps { className?: string; size?: number }

export function BunnyIcon({ className = "", size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* left ear */}
      <ellipse cx="14" cy="11" rx="4" ry="8" fill="#c17a5a" opacity="0.25" />
      <ellipse cx="14" cy="11" rx="2.2" ry="5.5" fill="#c17a5a" opacity="0.35" />
      {/* right ear */}
      <ellipse cx="26" cy="11" rx="4" ry="8" fill="#c17a5a" opacity="0.25" />
      <ellipse cx="26" cy="11" rx="2.2" ry="5.5" fill="#c17a5a" opacity="0.35" />
      {/* head */}
      <circle cx="20" cy="23" r="11" fill="#e8ddd0" />
      {/* eyes */}
      <circle cx="16" cy="22" r="2" fill="#2d2926" />
      <circle cx="24" cy="22" r="2" fill="#2d2926" />
      <circle cx="16.8" cy="21.2" r="0.7" fill="white" />
      <circle cx="24.8" cy="21.2" r="0.7" fill="white" />
      {/* nose */}
      <ellipse cx="20" cy="26" rx="1.5" ry="1" fill="#c17a5a" opacity="0.7" />
      {/* whiskers */}
      <path d="M12 26 L17 26.5" stroke="#8c7b6e" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <path d="M12 27.5 L17 27.5" stroke="#8c7b6e" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <path d="M28 26 L23 26.5" stroke="#8c7b6e" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      <path d="M28 27.5 L23 27.5" stroke="#8c7b6e" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      {/* smile */}
      <path d="M18 29 Q20 31 22 29" stroke="#c17a5a" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* rosy cheeks */}
      <ellipse cx="13" cy="26" rx="3" ry="2" fill="#c17a5a" opacity="0.15" />
      <ellipse cx="27" cy="26" rx="3" ry="2" fill="#c17a5a" opacity="0.15" />
    </svg>
  );
}
