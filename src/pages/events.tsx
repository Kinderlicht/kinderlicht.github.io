import React, { useState } from "react";
import { createEvent } from "ics";
import { ConvertDateObject } from "../content/events/de_date";
import { eventIsSoon, type Event } from "../content/events/events";
import { graphql, HeadFC, PageProps } from "gatsby";
import Layout from "../components/layout";

type EventPageData = {
  allPublicEvent: {
    nodes: Event[];
  };
};

type IndexedEvent = Event & {
  eventId: number;
};

// CSS keyframes for highlight animation
const highlightStyles = `
@keyframes highlightPulse {
  0%, 100% { background-color: white; }
  50% { background-color: #fef3c7; }
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleId = "event-highlight-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = highlightStyles;
    document.head.appendChild(style);
  }
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function EventCard({
  event,
  index,
  highlightedId,
}: {
  event: IndexedEvent;
  index: number;
  highlightedId: null | number;
}) {
  const icsFile = createEvent(event);
  let content: string | undefined = "Ups, da ist etwas schief gelaufen...";
  if (icsFile["error"] == null) {
    content = icsFile["value"];
  } else {
    console.log(icsFile["error"]);
  }
  const loc =
    event["geo"] &&
    `https://www.google.com/maps/search/?api=1&query=${event["geo"]["lat"]},${event["geo"]["lon"]}`;
  const eventDate = ConvertDateObject(event["start"]);
  const currentDate = new Date();
  const isAborted = event["status"] === "CANCELLED";
  const isFinished = eventDate < currentDate || isAborted;
  const isSoon =
    !isFinished && eventDate.getTime() - currentDate.getTime() < eventIsSoon;

  // Format date parts for display
  const day = eventDate.getDate();
  const month = eventDate
    .toLocaleString("de-DE", { month: "short" })
    .toUpperCase();
  const year = eventDate.getFullYear();
  const time = eventDate.toLocaleString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article
      key={index}
      className={`group relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-2xl ${isFinished ? "bg-gray-50" : "bg-white hover:-translate-y-1"} ${highlightedId !== null && highlightedId === event.eventId ? "ring-4 ring-amber-400 animate-pulse-highlight" : ""}`}
      id={`event-${event["eventId"]}`}
      aria-labelledby={`event-title-${event.eventId}`}
      style={
        highlightedId !== null && highlightedId === event.eventId
          ? { animation: "highlightPulse 1.5s ease-in-out 2" }
          : {}
      }
    >
      {/* Top accent bar */}
      <div
        aria-hidden="true"
        className={`h-1.5 w-full ${isFinished ? "bg-gray-300" : isSoon ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-gray-300 to-gray-400"}`}
      ></div>

      <div className="p-6">
        <div className="flex gap-5">
          {/* Date box */}
          <time
            dateTime={eventDate.toISOString()}
            aria-label={eventDate.toLocaleString("de-DE", {
              dateStyle: "full",
              timeStyle: "short",
            })}
            className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center shadow-md ${isFinished ? "bg-gray-100" : "bg-gradient-to-br from-slate-600 to-slate-700"}`}
          >
            <span
              aria-hidden="true"
              className={`text-2xl font-bold leading-none ${isFinished ? "text-gray-700" : "text-white"}`}
            >
              {day}
            </span>
            <span
              aria-hidden="true"
              className={`text-xs font-semibold uppercase tracking-wide ${isFinished ? "text-gray-700" : "text-white"}`}
            >
              {month}
            </span>
            <span
              aria-hidden="true"
              className={`text-xs font-medium ${isFinished ? "text-gray-700" : "text-white"}`}
            >
              {year}
            </span>
          </time>

          {/* Event content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {isAborted ? (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  <span aria-hidden="true">✗</span> Abgesagt
                </span>
              ) : isFinished ? (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  <span aria-hidden="true">✓</span> Abgeschlossen
                </span>
              ) : isSoon ? (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
                  <span aria-hidden="true">🔥</span> Bevorstehend
                </span>
              ) : null}
            </div>

            <h2
              id={`event-title-${event.eventId}`}
              className="mb-2 text-xl font-bold text-gray-800"
            >
              {event["title"]}
            </h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
              <button
                type="button"
                onClick={() => download("event.ics", content || "")}
                className="group/time inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-800"
                aria-label={`${event.title} am ${eventDate.toLocaleDateString("de-DE")} um ${time} Uhr als Kalenderdatei herunterladen`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 3.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5H2.545c-.3 0-.545.224-.545.5zm6.5 5a.5.5 0 0 0-1 0V10H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V11H10a.5.5 0 0 0 0-1H8.5V8.5z" />
                </svg>
                <span className="underline decoration-dotted underline-offset-2 group-hover/time:decoration-solid">
                  {time} Uhr
                </span>
              </button>

              {loc && (
                <a
                  href={loc}
                  className="group/loc inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-800"
                  aria-label={`${event["location"]?.split(",")[0]} in Google Maps öffnen`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                  <span className="truncate max-w-[200px] underline decoration-dotted underline-offset-2 group-hover/loc:decoration-solid">
                    {event["location"]?.split(",")[0]}
                  </span>
                </a>
              )}
            </div>

            <p className="text-sm leading-relaxed text-gray-700">
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    event["htmlContent"] ||
                    event["description"] ||
                    "Es liegt keine Beschreibung vor.",
                }}
              />
            </p>
          </div>
        </div>

        {/* Action buttons */}
        {!isFinished && event["url"] && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-3">
            <a
              href={event["url"]}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-700 px-5 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-orange-800"
            >
              {!event["url"].includes("gewinnspiel")
                ? "Anmelden"
                : "Teilnehmen"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                />
                <path
                  fillRule="evenodd"
                  d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default function EventPage({ data }: PageProps<EventPageData>) {
  const events = data.allPublicEvent.nodes;
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPast, setShowPast] = useState<boolean>(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  // Create indexed events (reverse index: last item = 0, first item = events.length - 1)
  const indexedEvents = events.map((event, idx) => ({
    ...event,
    eventId: events.length - 1 - idx,
  }));

  // Handle hash navigation on mount
  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const targetId = parseInt(hash, 10);
    if (isNaN(targetId)) return;

    const targetEvent = indexedEvents.find((e) => e.eventId === targetId);
    if (!targetEvent) return;

    const eventDate = ConvertDateObject(targetEvent.start);

    // Ensure past events are visible
    if (eventDate < new Date() && !showPast) {
      setShowPast(true);
    }

    // Scroll + highlight
    setTimeout(() => {
      const element = document.getElementById(`event-${targetId}`);
      if (!element) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
      setHighlightedId(targetId);

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedId(null);
      }, 3000);
    }, 100);
  }, []);

  let filtered = indexedEvents.filter((e) => {
    if (searchTerm !== "") {
      let text = e.title || "";
      text += " ";
      text += e.description || "";
      if (text.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1)
        return false;
    }

    if (startDate !== "") {
      const startDateDate = new Date(startDate);
      const eventStartDate = ConvertDateObject(e.start);
      if (eventStartDate < startDateDate) return false;
    }

    if (endDate !== "") {
      const endDateDate = new Date(endDate);
      const eventEndDate = ConvertDateObject(e.start);
      if (eventEndDate > endDateDate) return false;
    }

    // Filter past events if showPast is false
    if (!showPast) {
      const eventDate = ConvertDateObject(e.start);
      if (eventDate < new Date()) return false;
    }

    return true;
  });

  // Sort events: upcoming first (ascending by date), then past events (descending by date)
  filtered.sort((a, b) => {
    const dateA = ConvertDateObject(a.start);
    const dateB = ConvertDateObject(b.start);
    const now = new Date();
    const aIsUpcoming = dateA >= now;
    const bIsUpcoming = dateB >= now;

    // If both are upcoming or both are past, sort accordingly
    if (aIsUpcoming && bIsUpcoming) {
      // Upcoming events: nearest first (ascending)
      return dateA.getTime() - dateB.getTime();
    } else if (!aIsUpcoming && !bIsUpcoming) {
      // Past events: most recent first (descending)
      return dateB.getTime() - dateA.getTime();
    } else {
      // Upcoming events come before past events
      return aIsUpcoming ? -1 : 1;
    }
  });

  // Count upcoming events
  const upcomingCount = events.filter(
    (e) => ConvertDateObject(e.start) >= new Date(),
  ).length;
  const pastCount = events.filter(
    (e) => ConvertDateObject(e.start) < new Date(),
  ).length;

  return (
    <Layout>
      <div className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
        <h1 className="mb-16 text-3xl font-bold text-center">
          Unsere{" "}
          <span className="text-orange-700 dark:text-orange-400 no-underline">
            Events
          </span>
        </h1>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"
        ></div>
        <div
          aria-hidden="true"
          className="absolute top-1/3 right-0 w-80 h-80 bg-amber-200 rounded-full filter blur-3xl opacity-30 translate-x-1/2"
        ></div>
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/4 w-72 h-72 bg-yellow-200 rounded-full filter blur-3xl opacity-20"
        ></div>

        <div className="relative z-10 container max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-full mb-6 shadow-xl ring-4 ring-orange-100">
              <span aria-hidden="true" className="text-4xl">
                🎉
              </span>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Entdecke unsere kommenden Events und werde Teil unserer
              Gemeinschaft!
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-md border border-white/50">
                <span className="text-2xl font-bold text-orange-700">
                  {upcomingCount}
                </span>
                <span className="text-gray-600 ml-2">Kommende Events</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-md border border-white/50">
                <span className="text-2xl font-bold text-gray-500">
                  {pastCount}
                </span>
                <span className="text-gray-600 ml-2">Vergangene Events</span>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <section
            aria-labelledby="event-filter-heading"
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border border-white/50"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <span aria-hidden="true" className="text-xl">
                  🔍
                </span>
              </div>
              <h2
                id="event-filter-heading"
                className="text-xl font-bold text-gray-800"
              >
                Filter & Suche
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="event-search"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Suche
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    id="event-search"
                    type="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white text-gray-700 placeholder-gray-600 outline-none"
                    placeholder="Nach Event suchen..."
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor="event-start-date"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Von
                </label>
                <input
                  id="event-start-date"
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white text-gray-700 outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="event-end-date"
                  className="block text-sm font-medium text-gray-600 mb-2"
                >
                  Bis
                </label>
                <input
                  id="event-end-date"
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white text-gray-700 outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Toggle and Clear */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-5 border-t border-gray-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="show-past-events"
                  type="checkbox"
                  checked={showPast}
                  onChange={(e) => setShowPast(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-700"></div>
                <span className="ms-3 text-sm font-medium text-gray-600">
                  Vergangene Events anzeigen
                </span>
              </label>

              {(searchTerm || startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-800"
                >
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Filter zurücksetzen
                </button>
              )}
            </div>
          </section>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-700" aria-live="polite" aria-atomic="true">
              <span className="font-semibold text-gray-800">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "Event" : "Events"} gefunden
            </p>
          </div>

          {/* Events Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filtered.map((e, index) => (
                <EventCard
                  key={index}
                  event={e}
                  index={index}
                  highlightedId={highlightedId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <span aria-hidden="true" className="text-4xl">
                  📭
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">
                Keine Events gefunden
              </h2>
              <p className="text-gray-500 mb-6">
                Versuche andere Suchbegriffe oder passe die Filter an.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStartDate("");
                  setEndDate("");
                  setShowPast(true);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-100 px-5 py-2.5 font-medium text-orange-800 transition-colors hover:bg-orange-200"
              >
                Alle Events anzeigen
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <title>Veranstaltungen | Kinderlicht Wallersdorf</title>
);

export const query = graphql`
  query EventsPageQuery {
    allPublicEvent {
      nodes {
        start
        duration {
          hours
          minutes
        }
        url
        startInputType
        startOutputType
        title
        description
        location
        geo {
          lat
          lon
        }
        categories
        status
        busyStatus
        organizer {
          name
          email
        }
        attendees {
          name
          email
          rsvp
          partstat
          role
        }
        htmlContent
      }
    }
  }
`;
