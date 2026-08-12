import React from "react";
import MoneyAdder from "./money_adder";

interface FlameProps {
  money: number;
  total_money: number;
  currentActivity?: number;
  totalActivities?: number;
  compact?: boolean;
}

const clampProgress = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
};

export default function Flame({
  money,
  total_money,
  compact = false,
}: FlameProps) {
  const progress = clampProgress(total_money > 0 ? money / total_money : 0);
  const scale = compact ? 0.48 + progress * 0.26 : 1 + progress * 0.8;
  const glowIntensity = compact
    ? Math.min(12 + progress * 13, 25)
    : Math.min(30 + progress * 40, 70);
  const glowOpacity = 0.3 + progress * 0.4;

  return (
    <section
      aria-label="Gesammelte Spenden"
      className={`flex w-full flex-col items-center ${compact ? "max-w-[6.5rem]" : "max-w-[17rem]"}`}
    >
      {/*
       * Scaling with transform does not reserve space in the document flow.
       * This fixed stage preserves the original flame animation without
       * allowing it to collide with the total or neighboring carousel.
       */}
      <div
        aria-hidden="true"
        className={`flex justify-center ${compact ? "h-20 w-20 items-center rounded-full border border-orange-100 bg-orange-50/70" : "h-60 w-full items-end"}`}
      >
        <div
          className="relative"
          style={{
            filter: `drop-shadow(0 0 ${glowIntensity}px rgba(255, 165, 0, ${glowOpacity}))`,
          }}
        >
          <div
            className="flame-scale-container"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center bottom",
              transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div className="flame-container">
              <div className="flame-red flame-flame" />
              <div className="flame-orange flame-flame" />
              <div className="flame-yellow flame-flame" />
              <div className="flame-white flame-flame" />
            </div>
          </div>
        </div>
      </div>

      <div className={`relative z-10 ${compact ? "mt-2" : "mt-6"}`}>
        <MoneyAdder amount={money} compact={compact} />
      </div>

      {compact && (
        <span className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-slate-500">
          Spendensumme
        </span>
      )}

      <div
        className={`${compact ? "mt-1.5 h-1 w-12" : "mt-3 h-1.5 w-24"} overflow-hidden rounded-full bg-gray-200`}
      >
        <div
          role="progressbar"
          aria-label="Anteil der Spendensumme bis zur ausgewählten Unterstützung"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
          style={{
            width: `${progress * 100}%`,
            transition: "width 0.6s ease-out",
          }}
        />
      </div>
    </section>
  );
}
