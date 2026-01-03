import React from 'react';
import MoneyAdder from './money_adder';

interface FlameProps {
  money: number;
  total_money: number;
}

export default function Flame({ money, total_money }: FlameProps) {
  // Calculate the scale factor based on progress (1.0 at start, up to 2.0 at full)
  const progress = total_money > 0 ? money / total_money : 0;
  const scale = 1 + progress * 1.2; // Scale from 1x to 2.2x
  
  // Calculate glow intensity based on progress
  const glowIntensity = Math.min(30 + progress * 40, 70);
  const glowOpacity = 0.3 + progress * 0.4;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Glow background effect */}
      <div
        className="relative"
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px rgba(255, 165, 0, ${glowOpacity}))`,
        }}
      >
        {/* Outer container handles scaling with smooth transition */}
        <div
          className="flame-scale-container"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center bottom',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Inner container maintains its flame-flicker animation */}
          <div className="flame-container">
            <div className="flame-red flame-flame"></div>
            <div className="flame-orange flame-flame"></div>
            <div className="flame-yellow flame-flame"></div>
            <div className="flame-white flame-flame"></div>
          </div>
        </div>
      </div>
      
      {/* Money display below the flame */}
      <div 
        className="mt-6"
        style={{
          transform: `scale(${1 + progress * 0.15})`,
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <MoneyAdder amount={money} />
      </div>
      
      {/* Progress indicator */}
      <div className="mt-3 w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
          style={{
            width: `${progress * 100}%`,
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
    </div>
  );
}
