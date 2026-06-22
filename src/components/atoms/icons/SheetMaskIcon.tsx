interface SheetMaskIconProps {
  className?: string;
  size?: number;
}

export function SheetMaskIcon({ className = "", size = 80 }: SheetMaskIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* mask body */}
      <ellipse cx="50" cy="54" rx="36" ry="34" fill="#e8ddd0" />
      <ellipse cx="50" cy="54" rx="36" ry="34" fill="url(#maskGrad)" />

      {/* ear loops */}
      <path d="M14 42 Q4 50 14 58" stroke="#c17a5a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M86 42 Q96 50 86 58" stroke="#c17a5a" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* left eye cutout */}
      <ellipse cx="36" cy="50" rx="9" ry="7" fill="#faf6f1" />
      {/* left eye shine */}
      <ellipse cx="36" cy="50" rx="5" ry="4" fill="#2d2926" opacity="0.08" />
      {/* left eye lashes */}
      <path d="M29 45 Q32 43 36 43 Q40 43 43 45" stroke="#c17a5a" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* right eye cutout */}
      <ellipse cx="64" cy="50" rx="9" ry="7" fill="#faf6f1" />
      <ellipse cx="64" cy="50" rx="5" ry="4" fill="#2d2926" opacity="0.08" />
      <path d="M57 45 Q60 43 64 43 Q68 43 71 45" stroke="#c17a5a" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* mouth cutout — cute smile */}
      <path d="M42 68 Q50 74 58 68" stroke="#faf6f1" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M42 68 Q50 74 58 68" stroke="#c17a5a" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* rosy cheeks */}
      <ellipse cx="24" cy="62" rx="6" ry="4" fill="#c17a5a" opacity="0.18" />
      <ellipse cx="76" cy="62" rx="6" ry="4" fill="#c17a5a" opacity="0.18" />

      {/* sparkles */}
      <circle cx="82" cy="28" r="2" fill="#c17a5a" opacity="0.5" />
      <circle cx="76" cy="22" r="1.2" fill="#7a8c5a" opacity="0.5" />
      <circle cx="88" cy="22" r="1.5" fill="#c17a5a" opacity="0.4" />

      <defs>
        <radialGradient id="maskGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5ede4" />
          <stop offset="100%" stopColor="#dfd0bf" />
        </radialGradient>
      </defs>
    </svg>
  );
}
