import type { DateArray, EventAttributes } from "ics";
import { ConvertDateObject } from "./de_date";

export type Event = EventAttributes & {
  start: DateArray;
  duration: EventDuration;
};

export type EventSchedule = Pick<Event, "start" | "duration">;

export const PUBLIC_EVENTS_URL =
  "https://portal.kinderlicht-wallersdorf.de/api/public-events";

export const eventIsSoon = 1000 * 60 * 60 * 24 * 30;

type EventDuration = {
  hours: number;
  minutes: number;
};

const hasStringValue = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const isNumberTupleDate = (value: unknown): value is number[] =>
  Array.isArray(value) &&
  value.length >= 5 &&
  value.every((entry) => typeof entry === "number" && Number.isFinite(entry));

const isDuration = (value: unknown): value is EventDuration => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const duration = value as Record<string, unknown>;

  return (
    typeof duration.hours === "number" &&
    Number.isFinite(duration.hours) &&
    typeof duration.minutes === "number" &&
    Number.isFinite(duration.minutes)
  );
};

const isPublicEvent = (value: unknown): value is Event => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const event = value as Record<string, unknown>;

  return (
    isNumberTupleDate(event.start) &&
    isDuration(event.duration) &&
    hasStringValue(event.title)
  );
};

export const parsePublicEvents = (data: unknown): Event[] => {
  if (!Array.isArray(data) || !data.every(isPublicEvent)) {
    throw new Error("Public events API returned an unexpected response.");
  }

  return data;
};

export const fetchPublicEvents = async (
  fetcher: typeof fetch = fetch,
): Promise<Event[]> => {
  const response = await fetcher(PUBLIC_EVENTS_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Public events API responded with ${response.status} ${response.statusText}`,
    );
  }

  return parsePublicEvents(await response.json());
};

export const getEventTiming = (
  event: EventSchedule,
  now: Date = new Date(),
) => {
  const start = ConvertDateObject(event.start);
  const duration =
    (event.duration.hours * 60 + event.duration.minutes) * 60_000;
  const end = new Date(start.getTime() + duration);

  return {
    start,
    end,
    isFinished: now >= end,
    isOngoing: now >= start && now < end,
    isSoon: now < start && start.getTime() - now.getTime() <= eventIsSoon,
  };
};

export const countUpcomingEvents = (
  events: EventSchedule[],
  now: Date = new Date(),
): number =>
  events.filter((event) => {
    const { isOngoing, isSoon } = getEventTiming(event, now);

    return isOngoing || isSoon;
  }).length;
