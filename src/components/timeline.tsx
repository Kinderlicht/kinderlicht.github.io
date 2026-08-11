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
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastIndex = Math.max(sortedActivities.length - 1, 0);
  const safeIndex = Math.min(currentIndex, lastIndex);
  const currentTotal = cumulativeTotals[safeIndex] ?? 0;
  const total = cumulativeTotals.at(-1) ?? 0;

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, lastIndex));
  }, [lastIndex]);

  return (
    <section className="site-card mx-auto w-full max-w-6xl p-5 sm:p-8">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-orange-700">
          Was wir gemeinsam bewegen
        </p>
        <h2 className="site-section-title mb-2">
          Jeder Beitrag trägt dazu bei, unsere Flamme zu entfachen
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-500 md:text-base">
          Reise durch unseren anonymisierten Tätigkeitsbericht und sieh, wie
          unsere Flamme durch die Unterstützung unserer Spender:innen wächst.
        </p>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-gray-600">
          Aktuell sind keine Spendendaten verfügbar.
        </div>
      ) : (
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-8">
          <div className="order-2 min-w-0 lg:order-1">
            <ActivityCarousel
              activities={sortedActivities}
              onIndexChange={setCurrentIndex}
            />
          </div>

          <div className="order-1 mx-auto flex w-full flex-col items-center justify-center lg:order-2">
            <Flame
              currentActivity={safeIndex + 1}
              money={currentTotal}
              totalActivities={sortedActivities.length}
              total_money={total}
            />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Gesamtspenden
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
