import { createEvent, type EventAttributes } from "ics";
import type { Event } from "./events";
import { safeWebUrl } from "../../utils/safe-url";

function omitNullFields(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(omitNullFields);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry != null)
        .map(([key, entry]) => [key, omitNullFields(entry)]),
    );
  }
  return value;
}

export function createCalendarEvent(event: Event & { eventId?: number }) {
  const { eventId, ...attributes } = event;
  // GraphQL returns null for absent optional fields; ics expects omitted fields.
  const calendarEvent = omitNullFields(attributes) as EventAttributes;
  calendarEvent.url = safeWebUrl(event.url);
  return createEvent(calendarEvent);
}
