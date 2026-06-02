import React, { useState } from "react";
import Flame from "./flame";
import ActivityCarousel, { Activity } from "./horizontal_scroll";

interface TimelineProps {
  activities: Activity[];
}

export default function Timeline({ activities }: TimelineProps) {
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const [currentTotal, setCurrentTotal] = useState(0);
  const total = sortedActivities.reduce(
    (sum, activity) => sum + activity.donation,
    0
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Unsere Spenden
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Entdecke unsere Spendengeschichte (anonymisiert)
        </p>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="max-w-xl mx-auto rounded-xl border border-orange-100 bg-orange-50 px-4 py-6 text-center text-sm text-gray-600">
          Aktuell sind keine Spendendaten verfügbar.
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Main content - stacked on mobile, side-by-side on desktop */}
          {/* Flame Section - appears first on mobile, on the right on desktop */}
          <div className="order-1 lg:order-2 flex flex-col items-center justify-center">
            <Flame money={currentTotal} total_money={total} />
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Gesamtspenden
              </p>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="order-2 lg:order-1 w-full lg:w-2/3">
            <ActivityCarousel
              activities={sortedActivities}
              onIndexChange={(index) => {
                setCurrentTotal(
                  sortedActivities
                    .slice(0, index + 1)
                    .map((d) => d.donation)
                    .reduce((a, b) => a + b, 0)
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
