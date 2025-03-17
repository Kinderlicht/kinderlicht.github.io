import React, { useState } from "react";
import Flame from "./flame";
import ActivityCarousel, { Activity } from "./horizontal_scroll";

interface TimelineProps {
  activities: Activity[];
}

export default function Timeline({ activities }: TimelineProps) {
  activities = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const [currentTotal, setCurrentTotal] = useState(0);
  const total = activities.map((d) => d.donation).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full grid lg:grid-cols-4 grid-cols-3">
      <div className="lg:col-span-3 col-span-2">
        <ActivityCarousel
          activities={activities}
          onIndexChange={(index) => {
            setCurrentTotal(
              activities
                .slice(0, index + 1)
                .map((d) => d.donation)
                .reduce((a, b) => a + b, 0)
            );
          }}
        />
      </div>

      <div className="lg:col-span-1 col-span-1 flex items-center justify-center h-full">
        <Flame money={currentTotal} total_money={total} />
      </div>
    </div>
  );
}
