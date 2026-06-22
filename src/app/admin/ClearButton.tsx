"use client";
import { useState, useTransition } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";

interface ClearButtonProps {
  label: string;
  confirmMessage: string;
  action: () => Promise<void>;
}

export function ClearButton({ label, confirmMessage, action }: ClearButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await action();
      setConfirming(false);
    });
  }

  return (
    <div className="flex items-center gap-3">
      {confirming && (
        <span className="text-sm text-[#8c7b6e]">{confirmMessage}</span>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="text-sm px-4 py-2 rounded-xl border-2 transition-all duration-150"
        style={{
          borderColor: confirming ? "#c17a5a" : "#e8ddd0",
          backgroundColor: confirming ? "#c17a5a" : "white",
          color: confirming ? "white" : "#8c7b6e",
        }}
      >
        {isPending ? tr.admin.clearing : confirming ? tr.admin.yesClear : label}
      </button>
      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-[#8c7b6e] hover:text-[#2d2926] transition-colors"
        >
          {tr.admin.cancel}
        </button>
      )}
    </div>
  );
}
