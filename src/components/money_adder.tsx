import React, { FC, useEffect, useState } from "react";

interface MoneyAdderProps {
  /** The current total balance you want to display. */
  amount: number;
}

const MoneyAdder: FC<MoneyAdderProps> = ({ amount }) => {
  // Keep track of the previous amount so we can detect increments/decrements
  const [oldAmount, setOldAmount] = useState<number>(amount);

  // The number actually displayed in the UI
  const [displayAmount, setDisplayAmount] = useState<number>(amount);

  // Each floating item includes an ID, the diff value, and a color class.
  type FloatingItem = {
    id: number;
    diff: number; // e.g., +10 or -5
    colorClass: string; // e.g., "text-yellow-400" or "text-red-400"
  };
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  // Key used to re-mount <span> so CSS animation restarts each time
  const [animationKey, setAnimationKey] = useState<number>(0);

  useEffect(() => {
    if (amount !== oldAmount) {
      const diff = amount - oldAmount;

      // Update the displayed amount
      setDisplayAmount(amount);

      // Only animate if there is a change (could be positive or negative)
      if (diff !== 0) {
        // 1) Increment the animation key => re-trigger the shake/glow
        setAnimationKey((prev) => prev + 1);

        // 2) Determine color based on diff
        const colorClass = diff > 0 ? "text-yellow-400" : "text-red-400";

        // 3) Create a floating item to show +X or -X
        const id = Date.now(); // or any unique ID generator
        setFloatingItems((prev) => [
          ...prev,
          { id, diff, colorClass }
        ]);
      }

      // Update oldAmount to the new value
      setOldAmount(amount);
    }
  }, [amount, oldAmount]);

  // Remove the floating text after its animation ends
  function handleAnimationEnd(id: number) {
    setFloatingItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="relative text-2xl text-center">
      <span
        key={animationKey}
        className="inline-block font-bold text-3xl money-added"
      >
        {displayAmount}€
      </span>

      {/* Render each floating amount as absolutely positioned within this container */}
      {floatingItems.map((item) => (
        <span
          key={item.id}
          className={`absolute left-1/2 -translate-x-1/2 font-bold ${item.colorClass} float-up-animation`}
          onAnimationEnd={() => handleAnimationEnd(item.id)}
        >
          {/* Show + sign only if diff > 0 */}
          {item.diff > 0 ? `+${item.diff}€` : `${item.diff}€`}
        </span>
      ))}
    </div>
  );
};

export default MoneyAdder;
