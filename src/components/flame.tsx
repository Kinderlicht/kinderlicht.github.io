import React from 'react';
import MoneyAdder from './money_adder';

interface FlameProps {
  money: number;
  total_money: number;
}

export default function Flame({ money, total_money }: FlameProps) {
  return (
    // Outer container handles scaling.
    <div
      style={{
        transform: `scale(${1 + money / total_money})`,
        transformOrigin: 'center center',
        transition: 'transform 0.5s ease-in-out',
        display: 'inline-block', // so the scaling wraps only the flame
      }}
    >
      {/* Inner container maintains its flame-flicker animation */}
      <div className="flame-container">
        <div className="bg-center flame-red flame-flame"></div>
        <div className="flame-orange flame-flame"></div>
        <div className="flame-yellow flame-flame"></div>
        <div className="flame-white flame-flame"></div>
        <MoneyAdder amount={money} />
      </div>
    </div>
  );
}
