import React, { FC, useEffect, useRef, useState } from "react";

interface MoneyAdderProps {
  /** The current total balance you want to display. */
  amount: number;
  compact?: boolean;
}

export const formatCurrency = (cents: number): string => {
  if (cents < 0) {
    return `-${formatCurrency(-cents)}`;
  }
  const euros = cents / 100;

  if (euros >= 1000000) {
    return `${(euros / 1000000).toFixed(1)}M€`;
  } else if (euros >= 10000) {
    return `${(euros / 1000).toFixed(1)}T€`;
  } else if (euros >= 1000) {
    return (
      euros.toFixed(0).charAt(0) +
      "." +
      euros.toFixed(0).slice(1) +
      "," +
      euros.toFixed(2).split(".")[1] +
      "€"
    );
  } else {
    return `${euros.toFixed(2).replace(".", ",")}€`;
  }
};

const MoneyAdder: FC<MoneyAdderProps> = ({ amount, compact = false }) => {
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
  const nextFloatingItemId = useRef(0);

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
        // A monotonic ID remains unique even when several updates land in the
        // same millisecond during fast carousel navigation.
        const id = ++nextFloatingItemId.current;
        setFloatingItems((prev) => [...prev, { id, diff, colorClass }]);
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
    <div className="relative text-center">
      <span
        aria-live="polite"
        aria-atomic="true"
        key={animationKey}
        className={`money-added inline-block font-bold tabular-nums ${compact ? "text-lg sm:text-xl" : "text-3xl"}`}
      >
        {formatCurrency(displayAmount)}
      </span>

      {/* Render each floating amount as absolutely positioned within this container */}
      {floatingItems.map((item) => (
        <span
          aria-hidden="true"
          key={item.id}
          className={`absolute left-1/2 -translate-x-1/2 font-bold ${item.colorClass} float-up-animation`}
          onAnimationEnd={() => handleAnimationEnd(item.id)}
        >
          {/* Show + sign only if diff > 0 */}
          {item.diff > 0
            ? `+${formatCurrency(item.diff)}`
            : `${formatCurrency(item.diff)}`}
        </span>
      ))}
    </div>
  );
};

export default MoneyAdder;
