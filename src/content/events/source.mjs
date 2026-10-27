const PUBLIC_EVENTS_URL =
  "https://portal.kinderlicht-wallersdorf.de/api/public-events";
const CACHE_KEY = "public-events";

const isPublicEvent = (event) =>
  event &&
  Array.isArray(event.start) &&
  event.start.length >= 5 &&
  event.start.every(Number.isFinite) &&
  Number.isFinite(event.duration?.hours) &&
  Number.isFinite(event.duration?.minutes) &&
  typeof event.title === "string" &&
  event.title.length > 0;

const isEventList = (data) => Array.isArray(data) && data.every(isPublicEvent);

// A failed import must never replace the published calendar with an empty page.
export async function fetchPublicEvents({
  cache,
  reporter,
  fetcher = fetch,
  wait = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds)),
}) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await wait(attempt * 1000);
    let events;
    try {
      const response = await fetcher(PUBLIC_EVENTS_URL, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) {
        throw new Error(
          `Public events API responded with ${response.status} ${response.statusText}`,
        );
      }
      events = await response.json();
      if (!isEventList(events)) {
        throw new Error("Public events API returned an unexpected response.");
      }
    } catch (error) {
      lastError = error;
      reporter.warn(
        `Public events fetch attempt ${attempt + 1}/3 failed: ${error.message}`,
      );
      continue;
    }

    try {
      await cache.set(CACHE_KEY, events);
    } catch (error) {
      reporter.warn(`Could not cache public events: ${error.message}`);
    }
    reporter.info(`Loaded ${events.length} public events from the portal.`);
    return events;
  }

  const cachedEvents = await cache.get(CACHE_KEY);
  if (isEventList(cachedEvents)) {
    reporter.warn(
      `Using ${cachedEvents.length} cached public events after the portal fetch failed.`,
    );
    return cachedEvents;
  }
  throw new Error(
    "Could not load public events and no valid cached feed is available. Stopping the build to preserve the published calendar.",
    { cause: lastError },
  );
}
