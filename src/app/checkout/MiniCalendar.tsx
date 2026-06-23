"use client";
import { useState } from "react";

interface Props {
  value: string;       // YYYY-MM-DD
  minValue: string;    // YYYY-MM-DD
  onChange: (date: string) => void;
  locale: string;
}

const DAY_LABELS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_LABELS_KO = ["일", "월", "화", "수", "목", "금", "토"];

function toStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseStr(s: string): [number, number, number] {
  const [y, m, d] = s.split("-").map(Number);
  return [y, m - 1, d];
}

export function MiniCalendar({ value, minValue, onChange, locale }: Props) {
  const [selY, selMo] = parseStr(value);
  const [viewY, setViewY] = useState(selY);
  const [viewMo, setViewMo] = useState(selMo);

  const [minY, minMo] = parseStr(minValue);
  const isKo = locale === "ko";
  const dayLabels = isKo ? DAY_LABELS_KO : DAY_LABELS_EN;

  const monthNames = isKo
    ? ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const daysInMonth = new Date(viewY, viewMo + 1, 0).getDate();
  const firstDow = new Date(viewY, viewMo, 1).getDay();

  function prevMonth() {
    if (viewY === minY && viewMo === minMo) return;
    if (viewMo === 0) { setViewY(viewY - 1); setViewMo(11); }
    else setViewMo(viewMo - 1);
  }
  function nextMonth() {
    if (viewMo === 11) { setViewY(viewY + 1); setViewMo(0); }
    else setViewMo(viewMo + 1);
  }

  const canGoPrev = !(viewY === minY && viewMo === minMo);
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5ede4] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#6b4f3a]"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-[#2d2926]">
          {isKo ? `${viewY}년 ${monthNames[viewMo]}` : `${monthNames[viewMo]} ${viewY}`}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5ede4] transition-colors text-[#6b4f3a]"
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {dayLabels.map((d) => (
          <div key={d} className="text-center text-[10px] uppercase tracking-wider text-[#8c7b6e] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;

          const dateStr = toStr(viewY, viewMo, day);
          const isPast = dateStr < minValue;
          const isSelected = dateStr === value;
          const isToday = dateStr === minValue;

          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => onChange(dateStr)}
              className={[
                "h-9 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                isPast
                  ? "text-[#d4c4b8] cursor-not-allowed"
                  : isSelected
                  ? "bg-[#c17a5a] text-white shadow-sm"
                  : isToday
                  ? "border-2 border-[#c17a5a] text-[#c17a5a] hover:bg-[#fdf8f4]"
                  : "text-[#2d2926] hover:bg-[#f5ede4]",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
