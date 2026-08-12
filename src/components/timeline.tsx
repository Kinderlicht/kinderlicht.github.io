import React, { useEffect, useMemo, useState } from "react";
import Flame from "./flame";
import ActivityCarousel, { Activity } from "./horizontal_scroll";

interface TimelineProps {
  activities: Activity[];
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
  const currentTotal = cumulativeTotals[safeIndex] ?? 0;
  const total = cumulativeTotals.at(-1) ?? 0;

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, lastIndex));
  }, [lastIndex]);

  return (
    <section className="site-card mx-auto w-full max-w-6xl overflow-hidden">
      {sortedActivities.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-gray-600">
          Aktuell sind keine Spendendaten verfügbar.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-4 p-5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6 sm:p-6">
            <Flame
              compact
              currentActivity={safeIndex + 1}
              money={currentTotal}
              totalActivities={sortedActivities.length}
              total_money={total}
            />

            <div className="min-w-0">
              <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-orange-700">
                Tätigkeitsbericht
              </p>
              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Hilfe, die sichtbar wird
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Unsere Flamme steht für {sortedActivities.length} anonymisierte
                Unterstützungen. Im Bericht kannst du ihre Wirkung Schritt für
                Schritt entdecken.
              </p>
              <p
                aria-live="polite"
                className="mt-3 text-xs font-semibold text-slate-500"
              >
                {safeIndex === lastIndex
                  ? "Gesamtsumme aller Einträge"
                  : "Stand nach Eintrag " +
                    (safeIndex + 1) +
                    " von " +
                    sortedActivities.length}
              </p>
            </div>
          </div>

          <details className="group border-t border-slate-200">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-orange-50 hover:text-orange-900 focus-visible:outline-none sm:px-6 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="group-open:hidden">Einträge ansehen</span>
                <span className="hidden group-open:inline">
                  Einträge ausblenden
                </span>
              </span>
              <svg
                aria-hidden="true"
                className="h-5 w-5 flex-none text-orange-700 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="m6 9 6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </summary>
            <div className="border-t border-slate-200 bg-slate-50 p-3 sm:p-5">
              <ActivityCarousel
                activities={sortedActivities}
                initialIndex={lastIndex}
                onIndexChange={setCurrentIndex}
              />
            </div>
          </details>
        </>
      )}
    </section>
  );
}
