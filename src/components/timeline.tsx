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
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2.25rem] border border-orange-100 bg-gradient-to-br from-orange-50/90 via-white to-amber-50/70 px-3 py-7 shadow-[0_28px_90px_-50px_rgba(154,52,18,0.55)] sm:p-8">
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-orange-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-amber-200/35 blur-3xl"
      />

      <div className="relative mb-8 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
          Was wir gemeinsam bewegen
        </p>
        <h2 className="mb-2 text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
          Jeder Beitrag wird zum Licht
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-gray-500 md:text-base">
          Reise durch unseren anonymisierten Tätigkeitsbericht und sieh, wie aus
          vielen Lichtmomenten ein großes Feuer wird.
        </p>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="relative mx-auto max-w-xl rounded-2xl border border-orange-100 bg-white px-4 py-6 text-center text-sm text-gray-600">
          Aktuell sind keine Spendendaten verfügbar.
        </div>
      ) : (
        <div className="relative grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-8">
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
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Gesamtspenden
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
