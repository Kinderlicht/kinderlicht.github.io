import React, { useState } from 'react';
import Flame from './flame';
import MoneyAdder from './money_adder';
import ActivityCarousel, { Activity } from './horizontal_scroll';



interface TimelineProps {
  activities: Activity[];
}

export default function Timeline({ activities }: TimelineProps) {
  const [currentTotal, setCurrentTotal] = useState(0);
  const total = activities.map(d => d.donation).reduce((a, b) => a + b, 0);

  const style = {
    transform: `scale(${1 + currentTotal / total})`,
    transition: 'transform 0.2s ease-in-out',
  };

  return (
    <div className="w-full grid lg:grid-cols-4 grid-cols-3">


<div className='lg:col-span-3 col-span-2'>
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

<div className='lg:col-span-1 col-span-1 flex items-center justify-center h-full' style={style}>
  {/* 
    Ensure the Flame component either accepts a style prop or has internal styles that set:
    transform-origin: center center;
  */}
  <Flame money={currentTotal} />
</div>

    </div>
  );
}
