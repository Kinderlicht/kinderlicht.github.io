import type { EventAttributes } from "ics";

export type Event = EventAttributes;

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
  fetcher: typeof fetch = fetch
): Promise<Event[]> => {
  const response = await fetcher(PUBLIC_EVENTS_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Public events API responded with ${response.status} ${response.statusText}`
    );
  }

  return parsePublicEvents(await response.json());
};

const dateFromArray = (date: number[]) => new Date(date.slice(0, 3).join("-"));

export const countUpcomingEvents = (
  events: Array<Pick<Event, "start">>
): number =>
  events.filter((event) => {
    const eventDate = dateFromArray(event.start);
    const now = new Date();

    return (
      eventDate >= now && eventDate.getTime() - now.getTime() <= eventIsSoon
    );
  }).length;
