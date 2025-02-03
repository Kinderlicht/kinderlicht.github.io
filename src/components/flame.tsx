import React from 'react';
import MoneyAdder from './money_adder';

interface FlameProps {
  money: number;
}

export default function Flame(
  {money} : FlameProps
) {
  return (
    <div className="flame-container -left-2">
      <div className="bg-center flame-red flame-flame"></div>
      <div className="flame-orange flame-flame"></div>
      <div className="flame-yellow flame-flame"></div>
      <div className="flame-white flame-flame"></div>
      <MoneyAdder amount={money} />
    </div>
  );
}
