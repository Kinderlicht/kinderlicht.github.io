import { useEffect, useState } from "react";
import {
  eventIsSoon,
  getEventTiming,
  type EventSchedule,
} from "../content/events/events";

// Refresh at event boundaries, and when returning to a previously opened tab.
export default function useEventTime(events: EventSchedule[]) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const current = new Date();
      setNow(current);
      let delay = 60_000;

      for (const event of events) {
        const { start, end } = getEventTiming(event, current);
        for (const boundary of [
          start.getTime() - eventIsSoon,
          start.getTime(),
          end.getTime(),
        ]) {
          const remaining = boundary - current.getTime();
          if (remaining > 0) delay = Math.min(delay, remaining);
        }
      }

      timer = setTimeout(refresh, delay);
    };

    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [events]);

  return now;
}
