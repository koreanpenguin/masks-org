interface IconProps { className?: string; size?: number }

export function CartIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* handle */}
      <path d="M4 6 L6 6 L10 18 Q10.5 20 13 20 L21 20 Q23 20 23.5 18 L26 9 L8 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* wheels */}
      <circle cx="13" cy="24" r="2" fill="currentColor" />
      <circle cx="21" cy="24" r="2" fill="currentColor" />
      {/* tiny heart inside basket */}
      <path d="M15 13 Q15 11.5 16.5 11.5 Q18 11.5 18 13 Q18 14.5 16.5 16 Q15 14.5 15 13Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
