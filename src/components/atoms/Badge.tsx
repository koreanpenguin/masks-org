interface BadgeProps {
  label: string;
  variant?: "sale" | "new" | "staff" | "bestseller" | "default";
}

const variantStyles: Record<string, string> = {
  sale: "bg-terracotta text-white",
  new: "bg-olive text-white",
  staff: "bg-bark text-white",
  bestseller: "bg-amber-700 text-white",
  default: "bg-parchment text-bark",
};

export function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
