import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatCurrency } from "./money_adder";

interface FlameProps {
  money: number;
  total_money: number;
  currentActivity?: number;
  totalActivities?: number;
}

const clampProgress = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 1);
};

export default function Flame({
  money,
  total_money,
  currentActivity,
  totalActivities,
}: FlameProps) {
  const id = useId().replace(/:/g, "");
  const prefersReducedMotion = useReducedMotion();
  const moneyProgress = clampProgress(
    total_money > 0 ? money / total_money : 0,
  );
  const activityProgress = clampProgress(
    currentActivity && totalActivities
      ? currentActivity / totalActivities
      : moneyProgress,
  );
  const flameScale = 0.58 + Math.sqrt(activityProgress) * 0.42;
  const percentage = Math.round(moneyProgress * 100);
  const animationDuration = prefersReducedMotion ? 0 : 0.34;

  return (
    <section
      aria-label={`${formatCurrency(money)} Gesamtspenden, ${percentage} Prozent des dargestellten Gesamtbetrags`}
      className="relative w-full max-w-[19rem] overflow-hidden rounded-[1.75rem] border border-orange-100 bg-gradient-to-b from-[#21140f] via-[#3a1c0e] to-[#1d1410] px-5 pb-5 pt-4 text-white shadow-[0_28px_80px_-35px_rgba(124,45,18,0.85)]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-14 h-44 rounded-full bg-orange-500/20 blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-orange-300">
            Unser Licht
          </p>
          <p className="mt-1 text-xs text-orange-100/65">
            wächst mit jeder Tätigkeit
          </p>
        </div>
        <motion.span
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-full border border-orange-300/20 bg-white/10 px-2.5 py-1 text-[0.68rem] font-bold tabular-nums text-orange-100 backdrop-blur-sm"
          initial={{ opacity: 0.6, scale: 0.9 }}
          key={percentage}
          transition={{ duration: animationDuration }}
        >
          {percentage} %
        </motion.span>
      </div>

      <div className="relative mx-auto h-[12.5rem] w-full" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 200 230"
        >
          <defs>
            <linearGradient
              id={`${id}-outer`}
              x1="42"
              x2="153"
              y1="190"
              y2="38"
            >
              <stop offset="0" stopColor="#f97316" />
              <stop offset="0.52" stopColor="#fb923c" />
              <stop offset="1" stopColor="#facc15" />
            </linearGradient>
            <linearGradient
              id={`${id}-inner`}
              x1="70"
              x2="128"
              y1="199"
              y2="92"
            >
              <stop offset="0" stopColor="#fff7d6" />
              <stop offset="0.45" stopColor="#fde047" />
              <stop offset="1" stopColor="#fb923c" />
            </linearGradient>
            <filter
              height="180%"
              id={`${id}-glow`}
              width="180%"
              x="-40%"
              y="-40%"
            >
              <feGaussianBlur stdDeviation={6 + moneyProgress * 5} />
            </filter>
          </defs>

          <motion.ellipse
            animate={{
              opacity: 0.3 + moneyProgress * 0.35,
              rx: 50 + moneyProgress * 22,
            }}
            cx="100"
            cy="211"
            fill="#fb923c"
            filter={`url(#${id}-glow)`}
            rx="54"
            ry="10"
            transition={{ duration: animationDuration }}
          />

          <motion.g
            animate={{
              transform: `translate(100px, 210px) scale(${flameScale}) translate(-100px, -210px)`,
            }}
            style={{ transformOrigin: "100px 210px" }}
            transition={{
              duration: animationDuration,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.path
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      d: [
                        "M100 210C59 210 35 187 39 151C42 124 60 109 60 83C60 56 76 31 101 12C94 46 119 54 120 84C132 70 138 53 135 37C159 63 164 94 154 120C172 137 174 166 160 187C148 204 127 210 100 210Z",
                        "M100 210C59 210 34 185 40 149C45 120 63 110 58 80C54 54 76 28 101 12C94 48 120 57 118 86C132 71 141 53 136 36C159 62 166 95 153 121C174 140 171 168 159 188C147 205 126 210 100 210Z",
                        "M100 210C59 210 35 187 39 151C42 124 60 109 60 83C60 56 76 31 101 12C94 46 119 54 120 84C132 70 138 53 135 37C159 63 164 94 154 120C172 137 174 166 160 187C148 204 127 210 100 210Z",
                      ],
                    }
              }
              d="M100 210C59 210 35 187 39 151C42 124 60 109 60 83C60 56 76 31 101 12C94 46 119 54 120 84C132 70 138 53 135 37C159 63 164 94 154 120C172 137 174 166 160 187C148 204 127 210 100 210Z"
              fill={`url(#${id}-outer)`}
              filter={`drop-shadow(0 0 ${8 + moneyProgress * 9}px rgba(249, 115, 22, 0.72))`}
              transition={{
                duration: 2.8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <motion.path
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      d: [
                        "M101 207C76 207 61 191 64 169C67 150 82 140 82 119C82 104 90 89 105 77C101 99 119 108 116 128C126 119 131 108 130 97C145 116 147 138 140 153C151 166 146 188 134 198C125 205 114 207 101 207Z",
                        "M101 207C76 207 60 191 65 168C69 149 84 139 81 117C79 102 91 87 105 77C101 101 121 109 115 129C128 118 132 107 130 96C145 115 148 139 139 154C151 168 145 188 133 199C124 205 113 207 101 207Z",
                        "M101 207C76 207 61 191 64 169C67 150 82 140 82 119C82 104 90 89 105 77C101 99 119 108 116 128C126 119 131 108 130 97C145 116 147 138 140 153C151 166 146 188 134 198C125 205 114 207 101 207Z",
                      ],
                    }
              }
              d="M101 207C76 207 61 191 64 169C67 150 82 140 82 119C82 104 90 89 105 77C101 99 119 108 116 128C126 119 131 108 130 97C145 116 147 138 140 153C151 166 146 188 134 198C125 205 114 207 101 207Z"
              fill={`url(#${id}-inner)`}
              transition={{
                delay: 0.15,
                duration: 2.2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <path
              d="M101 204C88 204 79 195 81 183C83 172 91 167 94 155C96 147 98 142 104 136C103 150 115 156 113 169C121 164 124 158 124 152C132 163 133 177 128 188C124 198 114 204 101 204Z"
              fill="#fffbea"
              opacity={0.78 + moneyProgress * 0.22}
            />
          </motion.g>

          {[0, 1, 2].map((spark) => (
            <motion.circle
              animate={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      cx: [82 + spark * 18, 75 + spark * 20],
                      cy: [124 - spark * 12, 35 - spark * 9],
                      opacity: [0, 0.85, 0],
                      r: [2.6, 1.7, 0.8],
                    }
              }
              cx={82 + spark * 18}
              cy={124 - spark * 12}
              fill={spark === 1 ? "#fef08a" : "#fb923c"}
              key={spark}
              opacity="0"
              r="2"
              transition={{
                delay: spark * 0.62,
                duration: 2.1 + spark * 0.2,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.45,
              }}
            />
          ))}
        </svg>
      </div>

      <div className="relative -mt-1 text-center">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-orange-200/65">
          Bis zu diesem Lichtmoment
        </p>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-3xl font-black tabular-nums tracking-tight text-white"
          initial={{ opacity: 0.65, y: 5 }}
          key={money}
          transition={{ duration: animationDuration }}
        >
          {formatCurrency(money)}
        </motion.p>
        {currentActivity && totalActivities ? (
          <p className="mt-1 text-xs tabular-nums text-orange-100/60">
            {currentActivity} von {totalActivities} Tätigkeiten
          </p>
        ) : null}
      </div>

      <div className="relative mt-4">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ width: `${moneyProgress * 100}%` }}
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-300 to-yellow-100"
            transition={{
              duration: animationDuration,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[0.6rem] font-semibold uppercase tracking-wider text-orange-100/40">
          <span>Erster Funke</span>
          <span>Heute</span>
        </div>
      </div>
    </section>
  );
}
