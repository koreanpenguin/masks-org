"use client";

const MIN_MINS = 12 * 60;      // 12:00 PM
const MAX_MINS = 21 * 60 + 30; // 9:30 PM

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toTotalMins(hour: number, minute: number, period: "AM" | "PM") {
  let h = hour % 12;
  if (period === "PM") h += 12;
  return h * 60 + minute;
}

function fromTotalMins(total: number): { hour: number; minute: number; period: "AM" | "PM" } {
  const clamped = Math.max(MIN_MINS, Math.min(MAX_MINS, total));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return { hour, minute: m, period };
}

function toTimeString(hour: number, minute: number, period: "AM" | "PM") {
  let h = hour % 12;
  if (period === "PM") h += 12;
  return `${pad(h)}:${pad(minute)}`;
}

function parseTime(value: string): { hour: number; minute: number; period: "AM" | "PM" } {
  if (!value) return { hour: 12, minute: 0, period: "PM" };
  const [h, m] = value.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return { hour, minute: m, period };
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const { hour, minute, period } = parseTime(value);
  const current = toTotalMins(hour, minute, period);

  function adjust(deltaMins: number) {
    const next = Math.max(MIN_MINS, Math.min(MAX_MINS, current + deltaMins));
    const { hour: h, minute: m, period: p } = fromTotalMins(next);
    onChange(toTimeString(h, m, p));
  }

  const canHourUp   = current + 60  <= MAX_MINS;
  const canHourDown = current - 60  >= MIN_MINS;
  const canMinUp    = current + 30  <= MAX_MINS;
  const canMinDown  = current - 30  >= MIN_MINS;

  const arrowBtn = (onClick: () => void, label: string, enabled: boolean, glyph: string) => (
    <button
      onClick={onClick}
      disabled={!enabled}
      aria-label={label}
      style={{
        fontFamily: "var(--font-jua), sans-serif",
        background: "none",
        border: "none",
        cursor: enabled ? "pointer" : "default",
        color: enabled ? "#c17a5a" : "#e8ddd0",
        fontSize: "1.3rem",
        lineHeight: 1,
        padding: "4px 12px",
        borderRadius: "10px",
        transition: "color 0.15s",
      }}
    >
      {glyph}
    </button>
  );

  const initialized = value !== "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        backgroundColor: initialized ? "#fdf8f4" : "#faf6f1",
        borderRadius: "20px",
        border: `2px solid ${initialized ? "#c17a5a" : "#e8ddd0"}`,
        padding: "20px 28px",
        transition: "all 0.15s",
      }}
    >
      {/* Hour */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        {arrowBtn(() => adjust(60), "Hour up", canHourUp, "▲")}
        <span style={{ fontFamily: "var(--font-jua), sans-serif", fontSize: "2.5rem", color: "#2d2926", minWidth: "2ch", textAlign: "center", lineHeight: 1.1 }}>
          {pad(hour)}
        </span>
        {arrowBtn(() => adjust(-60), "Hour down", canHourDown, "▼")}
      </div>

      {/* Colon */}
      <span style={{ fontFamily: "var(--font-jua), sans-serif", fontSize: "2.2rem", color: "#c17a5a", marginBottom: "2px" }}>:</span>

      {/* Minute */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        {arrowBtn(() => adjust(30), "Minute up", canMinUp, "▲")}
        <span style={{ fontFamily: "var(--font-jua), sans-serif", fontSize: "2.5rem", color: "#2d2926", minWidth: "2ch", textAlign: "center", lineHeight: 1.1 }}>
          {pad(minute)}
        </span>
        {arrowBtn(() => adjust(-30), "Minute down", canMinDown, "▼")}
      </div>

      {/* PM label */}
      <span style={{ fontFamily: "var(--font-jua), sans-serif", fontSize: "0.95rem", color: "#c17a5a", marginLeft: "10px", fontWeight: "bold" }}>
        PM
      </span>
    </div>
  );
}
