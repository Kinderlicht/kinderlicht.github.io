import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatCurrency } from "./money_adder";

export interface Activity {
  title: string;
  description: string;
  donation: number;
  date: string;
}

interface CarouselProps {
  activities: Activity[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
}

type NavigationState = {
  index: number;
  direction: -1 | 0 | 1;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.4}
    />
  </svg>
);

const EdgeIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      d={
        direction === "left"
          ? "M11 17l-5-5 5-5M18 18V6"
          : "M13 7l5 5-5 5M6 6v12"
      }
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.2}
    />
  </svg>
);

const ActivityCarousel: React.FC<CarouselProps> = ({
  activities,
  initialIndex = 0,
  onIndexChange,
}) => {
  const [{ index: currentIndex, direction }, setNavigation] =
    useState<NavigationState>({
      index: clamp(initialIndex, 0, Math.max(activities.length - 1, 0)),
      direction: 0,
    });
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const lastIndex = Math.max(activities.length - 1, 0);

  const goTo = useCallback(
    (requestedIndex: number) => {
      setNavigation((current) => {
        const nextIndex = clamp(requestedIndex, 0, lastIndex);

        if (nextIndex === current.index) {
          return current;
        }

        return {
          index: nextIndex,
          direction: nextIndex > current.index ? 1 : -1,
        };
      });
    },
    [lastIndex],
  );

  const moveBy = useCallback(
    (amount: number) => {
      setNavigation((current) => {
        const nextIndex = clamp(current.index + amount, 0, lastIndex);

        if (nextIndex === current.index) {
          return current;
        }

        return {
          index: nextIndex,
          direction: amount > 0 ? 1 : -1,
        };
      });
    },
    [lastIndex],
  );

  const handlePrev = useCallback(() => moveBy(-1), [moveBy]);
  const handleNext = useCallback(() => moveBy(1), [moveBy]);

  useEffect(() => {
    setNavigation((current) => {
      const nextIndex = clamp(current.index, 0, lastIndex);
      return nextIndex === current.index
        ? current
        : { index: nextIndex, direction: -1 };
    });
  }, [lastIndex]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Range inputs and buttons already implement their own keyboard behavior.
    // Handling their bubbling events here as well would advance twice.
    if (event.target !== event.currentTarget) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        handlePrev();
        break;
      case "ArrowRight":
        event.preventDefault();
        handleNext();
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(lastIndex);
        break;
      case "PageUp":
        event.preventDefault();
        moveBy(-5);
        break;
      case "PageDown":
        event.preventDefault();
        moveBy(5);
        break;
      default:
        break;
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    // Let the range control and buttons own their touch gesture. Otherwise a
    // slider drag could also be interpreted as a card swipe on touchend.
    if ((event.target as HTMLElement).closest("button, input")) {
      touchStart.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current || event.changedTouches.length === 0) {
      return;
    }

    const touch = event.changedTouches[0];
    const distanceX = touchStart.current.x - touch.clientX;
    const distanceY = touchStart.current.y - touch.clientY;
    touchStart.current = null;

    if (
      Math.abs(distanceX) < 44 ||
      Math.abs(distanceX) <= Math.abs(distanceY)
    ) {
      return;
    }

    moveBy(distanceX > 0 ? 1 : -1);
  };

  const years = useMemo(() => {
    if (activities.length === 0) {
      return { first: "", last: "" };
    }

    const firstDate = new Date(activities[0].date);
    const lastDate = new Date(activities[lastIndex].date);

    return {
      first: Number.isNaN(firstDate.getTime())
        ? ""
        : firstDate.getFullYear().toString(),
      last: Number.isNaN(lastDate.getTime())
        ? ""
        : lastDate.getFullYear().toString(),
    };
  }, [activities, lastIndex]);

  if (activities.length === 0) {
    return null;
  }

  const progressPercentage =
    activities.length === 1 ? 100 : (currentIndex / lastIndex) * 100;
  const cardVariants = {
    enter: (travelDirection: number) => ({
      x: prefersReducedMotion ? 0 : travelDirection >= 0 ? 56 : -56,
      opacity: prefersReducedMotion ? 1 : 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.22,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (travelDirection: number) => ({
      x: prefersReducedMotion ? 0 : travelDirection < 0 ? 42 : -42,
      opacity: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.14,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section
      aria-label="Tätigkeitsbericht durchblättern"
      aria-roledescription="Karussell"
      className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none ring-orange-300 transition-shadow focus-visible:ring-4 sm:p-4"
      onKeyDown={handleKeyDown}
      onTouchCancel={() => {
        touchStart.current = null;
      }}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
      style={{ touchAction: "pan-y" }}
      tabIndex={0}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-orange-700">
            Tätigkeitsbericht
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Unterstützung {currentIndex + 1} von {activities.length}
          </p>
        </div>
        {currentIndex !== lastIndex && (
          <button
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 active:scale-95"
            onClick={() => goTo(lastIndex)}
            type="button"
          >
            Aktuell
            <EdgeIcon direction="right" />
          </button>
        )}
      </div>

      <div className="relative h-[11.5rem] overflow-hidden rounded-xl sm:h-44">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            animate="center"
            className="absolute inset-0"
            custom={direction}
            exit="exit"
            initial="enter"
            key={`${currentIndex}-${activities[currentIndex].date}`}
            variants={cardVariants}
          >
            <ActivityCard
              activity={activities[currentIndex]}
              index={currentIndex + 1}
              total={activities.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 rounded-xl bg-stone-50 px-3 pb-2 pt-3">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-orange-100"
          >
            <motion.div
              animate={{ width: `${progressPercentage}%` }}
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400"
              transition={{
                duration: prefersReducedMotion ? 0 : 0.2,
                ease: "easeOut",
              }}
            />
          </div>
          <input
            aria-label={`Zeitstrahl, Unterstützung ${currentIndex + 1} von ${activities.length}`}
            className="activity-range relative z-10 block w-full cursor-pointer"
            max={lastIndex}
            min={0}
            onChange={(event) => goTo(Number(event.target.value))}
            step={1}
            type="range"
            value={currentIndex}
          />
        </div>
        <div className="mt-1 flex justify-between text-[0.65rem] font-semibold uppercase tracking-wider text-gray-600">
          <span>{years.first || "Anfang"}</span>
          <span>{years.last || "Heute"}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex justify-start">
          <button
            aria-label="Vorherige Tätigkeit"
            className="carousel-arrow-button"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            type="button"
          >
            <ArrowIcon direction="left" />
          </button>
        </div>

        <output
          aria-live="polite"
          className="min-w-[4.25rem] text-center text-xs font-bold tabular-nums text-gray-500"
        >
          {currentIndex + 1} / {activities.length}
        </output>

        <div className="flex justify-end">
          <button
            aria-label="Nächste Tätigkeit"
            className="carousel-arrow-button"
            disabled={currentIndex === lastIndex}
            onClick={handleNext}
            type="button"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <p className="sr-only">
        Mit den Pfeiltasten blättern, mit Pos1 zum Anfang und mit Ende zur
        neuesten Tätigkeit springen.
      </p>
    </section>
  );
};

interface ActivityCardProps {
  activity: Activity;
  index: number;
  total: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  index,
  total,
}) => {
  const date = new Date(activity.date);
  const formattedDate = Number.isNaN(date.getTime())
    ? activity.date
    : date.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <article
      aria-label={`Tätigkeit ${index} von ${total}: ${activity.title}`}
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <time
              dateTime={
                Number.isNaN(date.getTime())
                  ? undefined
                  : date.toISOString().slice(0, 10)
              }
              className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/75 px-2.5 py-1 text-[0.68rem] font-semibold text-gray-500 shadow-sm ring-1 ring-orange-100"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5 text-orange-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              {formattedDate}
            </time>
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900">
              {activity.title}
            </h3>
          </div>
          <div className="flex-shrink-0 rounded-lg bg-white/90 px-2.5 py-1.5 text-right shadow-sm ring-1 ring-orange-100">
            <span className="block text-[0.58rem] font-bold uppercase tracking-wider text-gray-600">
              Spende
            </span>
            <strong className="block text-base font-black tabular-nums text-orange-700">
              {formatCurrency(activity.donation)}
            </strong>
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
          {activity.description}
        </p>
      </div>
      <div className="mt-2 hidden items-center gap-2 border-t border-slate-200 pt-2 sm:flex">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_0_4px_rgba(251,146,60,0.14)]"
        />
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-orange-700">
          Gemeinsam wirkt mehr
        </span>
      </div>
    </article>
  );
};

export default ActivityCarousel;
