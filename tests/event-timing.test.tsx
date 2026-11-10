import assert from "node:assert/strict";
import test from "node:test";
import {
  countUpcomingEvents,
  getEventTiming,
  type EventSchedule,
} from "../src/content/events/events";

const event: EventSchedule = {
  start: [2026, 11, 21, 14, 0],
  duration: { hours: 4, minutes: 30 },
};

test("events stay active from their exact start until their full duration has elapsed", () => {
  for (const [time, ongoing, finished] of [
    ["2026-11-21T13:59:59.999", false, false],
    ["2026-11-21T14:00:00", true, false],
    ["2026-11-21T16:15:00", true, false],
    ["2026-11-21T18:29:59.999", true, false],
    ["2026-11-21T18:30:00", false, true],
    ["2026-11-21T18:30:00.001", false, true],
  ] as const) {
    const timing = getEventTiming(event, new Date(time));
    assert.equal(timing.isOngoing, ongoing, time);
    assert.equal(timing.isFinished, finished, time);
    assert.equal(
      countUpcomingEvents([event], new Date(time)),
      finished ? 0 : 1,
    );
  }
});

test("overnight events remain active into the next year", () => {
  const overnight: EventSchedule = {
    start: [2026, 12, 31, 21, 30],
    duration: { hours: 5, minutes: 45 },
  };
  assert.equal(
    getEventTiming(overnight, new Date("2027-01-01T03:14:59")).isOngoing,
    true,
  );
  assert.equal(
    getEventTiming(overnight, new Date("2027-01-01T03:15:00")).isFinished,
    true,
  );
});

test("multi-day events stay active even when they started outside the notification window", () => {
  const multiDay: EventSchedule = {
    start: [2026, 10, 1, 9, 0],
    duration: { hours: 40 * 24, minutes: 0 },
  };
  const now = new Date("2026-11-05T12:00:00");
  assert.equal(getEventTiming(multiDay, now).isOngoing, true);
  assert.equal(countUpcomingEvents([multiDay], now), 1);
  assert.equal(
    getEventTiming(multiDay, new Date("2026-11-11T12:00:00")).isFinished,
    true,
  );
});

test("notifications include later today and ongoing events, excluding finished and distant events", () => {
  const now = new Date("2026-11-21T16:00:00");
  assert.equal(
    countUpcomingEvents(
      [
        event,
        { ...event, start: [2026, 11, 21, 18, 0] },
        { ...event, start: [2026, 11, 21, 10, 0] },
        { ...event, start: [2026, 12, 21, 16, 0] },
        { ...event, start: [2026, 12, 21, 16, 1] },
      ],
      now,
    ),
    3,
  );
});

test("zero-duration events do not remain ongoing indefinitely", () => {
  const instant: EventSchedule = {
    ...event,
    duration: { hours: 0, minutes: 0 },
  };
  const now = new Date("2026-11-21T14:00:00");
  assert.equal(getEventTiming(instant, now).isFinished, true);
  assert.equal(getEventTiming(instant, now).isOngoing, false);
  assert.equal(countUpcomingEvents([instant], now), 0);
});
