"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface TransitionContextValue {
  triggerTransition: (fn: () => void) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  triggerTransition: (fn) => fn(),
});

export function useLocaleTransition() {
  return useContext(TransitionContext);
}

export function LocaleTransitionProvider({ children }: { children: ReactNode }) {
  const [fading, setFading] = useState(false);

  const triggerTransition = useCallback((fn: () => void) => {
    setFading(true);
    setTimeout(() => {
      fn();
      setTimeout(() => setFading(false), 40);
    }, 150);
  }, []);

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      <div
        className="flex flex-col flex-1"
        style={{
          filter: fading ? "blur(6px)" : "blur(0px)",
          opacity: fading ? 0.4 : 1,
          transition: "filter 150ms ease, opacity 150ms ease",
        }}
      >
        {children}
      </div>
    </TransitionContext.Provider>
  );
}
