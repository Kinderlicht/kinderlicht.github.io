import assert from "node:assert/strict";
import test from "node:test";
import { fetchPublicEvents } from "../src/content/events/source.mjs";

const events = [
  {
    title: "Weihnachtsstand",
    start: [2026, 12, 21, 18, 0],
    duration: { hours: 3, minutes: 0 },
  },
];

function fixture(cached?: unknown) {
  const values = new Map<string, unknown>([["public-events", cached]]);
  const warnings: string[] = [];
  return {
    values,
    warnings,
    cache: {
      get: async (key: string) => values.get(key),
      set: async (key: string, value: unknown) => {
        values.set(key, value);
      },
    },
    reporter: {
      warn: (message: string) => warnings.push(message),
      info: () => {},
    },
    wait: async () => {},
  };
}

test("a transient portal 500 retries and imports events without map coordinates", async () => {
  const options = fixture();
  let attempts = 0;
  const result = await fetchPublicEvents({
    ...options,
    fetcher: async (_url: string, init: RequestInit) => {
      assert.ok(init.signal);
      return ++attempts === 1
        ? new Response("Error", { status: 500 })
        : Response.json(events);
    },
  });
  assert.equal(attempts, 2);
  assert.deepEqual(result, events);
  assert.deepEqual(options.values.get("public-events"), events);
});

test("an unavailable portal retains the last valid cached calendar", async () => {
  const options = fixture(events);
  let attempts = 0;
  assert.deepEqual(
    await fetchPublicEvents({
      ...options,
      fetcher: async () => {
        attempts++;
        throw new Error("fetch failed");
      },
    }),
    events,
  );
  assert.equal(attempts, 3);
  assert.ok(
    options.warnings.some((message) =>
      message.includes("cached public events"),
    ),
  );
});

test("a failed import without usable cache stops deployment instead of publishing an empty calendar", async () => {
  for (const cached of [
    undefined,
    { error: "upstream error" },
    [{ title: "Invalid date", start: null }],
  ]) {
    for (const response of [
      () => new Response("Error", { status: 500 }),
      () => Response.json({ error: "unavailable" }),
    ]) {
      await assert.rejects(
        fetchPublicEvents({
          ...fixture(cached),
          fetcher: async () => response(),
        }),
        /Stopping the build/,
      );
    }
  }
});

test("a successful empty feed removes old events and cache write failures do not discard a valid feed", async () => {
  const options = fixture(events);
  assert.deepEqual(
    await fetchPublicEvents({
      ...options,
      fetcher: async () => Response.json([]),
    }),
    [],
  );
  assert.deepEqual(options.values.get("public-events"), []);
  options.cache.set = async () => {
    throw new Error("cache unavailable");
  };
  assert.deepEqual(
    await fetchPublicEvents({
      ...options,
      fetcher: async () => Response.json(events),
    }),
    events,
  );
});
