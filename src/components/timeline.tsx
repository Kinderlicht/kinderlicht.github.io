import React, { useEffect, useMemo, useState } from "react";
import type { ActivityReport } from "../content/donations";
import Flame from "./flame";
import { formatCurrency } from "./money_adder";

interface TimelineProps {
  activities: ActivityReport[];
}

export default function Timeline({ activities }: TimelineProps) {
  const sortedActivities = useMemo(
    () =>
      [...activities].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [activities],
  );
  const cumulativeTotals = useMemo(
    () =>
      sortedActivities.reduce<number[]>((totals, activity) => {
        totals.push((totals.at(-1) ?? 0) + activity.donation);
        return totals;
      }, []),
    [sortedActivities],
  );
  const lastIndex = Math.max(sortedActivities.length - 1, 0);
  const [currentIndex, setCurrentIndex] = useState(lastIndex);
  const safeIndex = Math.min(currentIndex, lastIndex);
  const currentActivity = sortedActivities[safeIndex];
  const currentTotal = cumulativeTotals[safeIndex] ?? 0;
  const total = cumulativeTotals.at(-1) ?? 0;

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, lastIndex));
  }, [lastIndex]);

  if (!currentActivity) {
    return (
      <section className="site-card mx-auto w-full max-w-6xl px-5 py-8 text-center text-sm text-gray-600">
        Aktuell sind keine Spendendaten verfügbar.
      </section>
    );
  }

  const currentDate = new Date(currentActivity.date);
  const formattedDate = Number.isNaN(currentDate.getTime())
    ? currentActivity.date
    : currentDate.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  const firstDate = new Date(sortedActivities[0].date);
  const lastDate = new Date(sortedActivities[lastIndex].date);
  const firstYear = Number.isNaN(firstDate.getTime())
    ? "Anfang"
    : firstDate.getFullYear().toString();
  const lastYear = Number.isNaN(lastDate.getTime())
    ? "Heute"
    : lastDate.getFullYear().toString();
  const progressPercentage =
    sortedActivities.length === 1 ? 100 : (safeIndex / lastIndex) * 100;

  return (
    <section
      aria-labelledby="activity-report-heading"
      className="site-card mx-auto w-full max-w-6xl p-4 sm:p-5"
    >
      <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5">
        <Flame
          compact
          currentActivity={safeIndex + 1}
          money={currentTotal}
          totalActivities={sortedActivities.length}
          total_money={total}
        />

        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <h2
              id="activity-report-heading"
              className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-orange-700"
            >
              Tätigkeitsbericht
            </h2>
            <span className="text-xs font-semibold tabular-nums text-slate-500">
              Unterstützung {safeIndex + 1} von {sortedActivities.length}
            </span>
          </div>

          <p className="mb-2 text-xs leading-4 text-slate-500">
            Jede Unterstützung lässt unsere Flamme wachsen – genauso wie die
            Spendensumme.
          </p>

          <div>
            <h3 className="min-h-11 text-base font-bold leading-snug text-slate-950 sm:min-h-0 sm:text-lg">
              {currentActivity.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
              <time
                dateTime={
                  Number.isNaN(currentDate.getTime())
                    ? undefined
                    : currentDate.toISOString().slice(0, 10)
                }
              >
                {formattedDate}
              </time>
              <span aria-hidden="true">·</span>
              <span className="text-orange-700">
                Betrag: {formatCurrency(currentActivity.donation)}
              </span>
            </div>
            <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600 sm:min-h-0">
              {currentActivity.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-3">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-orange-100"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 transition-[width] duration-200"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <input
            aria-label="Unterstützung im Tätigkeitsbericht auswählen"
            aria-valuetext={`Unterstützung ${safeIndex + 1} von ${sortedActivities.length}: ${currentActivity.title}`}
            className="activity-range relative z-10 block w-full cursor-pointer"
            disabled={sortedActivities.length === 1}
            max={lastIndex}
            min={0}
            onChange={(event) => setCurrentIndex(Number(event.target.value))}
            step={1}
            type="range"
            value={safeIndex}
          />
        </div>
        <div className="mt-0.5 flex justify-between text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500">
          <span>{firstYear}</span>
          <span>{lastYear}</span>
        </div>
      </div>
    </section>
  );
}
