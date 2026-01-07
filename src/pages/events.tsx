import React, { useState } from "react";
import { createEvent } from "ics";
import { ConvertDate, ConvertDateObject } from "../content/events/de_date";
import { events, Event, eventIsSoon } from "../content/events/events";
import { HeadFC, Link } from "gatsby";
import Layout from "../components/layout";

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function EventCard({ event, index }: { event: Event; index: number }) {
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
  let eventDate = ConvertDateObject(event["start"]);
  let currentDate = new Date();
  let isFinished = eventDate < currentDate;
  let isSoon =
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
    <div
      key={index}
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 ${isFinished ? "opacity-60" : "hover:-translate-y-1"} ${highlightedId === event.eventId ? "transition-all duration-500 ring-4 ring-orange-400 bg-orange-50 scale-[1.01]" : ""}`}
      id={`event-${event["eventId"]}`}
    >
      {/* Top accent bar */}
      <div
        className={`h-1.5 w-full ${isFinished ? "bg-gray-300" : isSoon ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-orange-400 to-amber-500"}`}
      ></div>

      <div className="p-6">
        <div className="flex gap-5">
          {/* Date box */}
          <div
            className={`flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-md ${isFinished ? "bg-gray-100" : "bg-gradient-to-br from-orange-400 to-amber-500"}`}
          >
            <span
              className={`text-2xl font-bold ${isFinished ? "text-gray-500" : "text-white"}`}
            >
              {day}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${isFinished ? "text-gray-400" : "text-white/90"}`}
            >
              {month}
            </span>
          </div>

          {/* Event content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {isFinished ? (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  ✓ Abgeschlossen
                </span>
              ) : isSoon ? (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
                  🔥 Bevorstehend
                </span>
              ) : null}
            </div>

            <h3
              className={`text-xl font-bold mb-2 ${isFinished ? "text-gray-500" : "text-gray-800 group-hover:text-orange-600 transition-colors"}`}
            >
              {event["title"]}
            </h3>

            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
              <button
                onClick={() => download("event.ics", content || "")}
                className="inline-flex items-center gap-1.5 hover:text-orange-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 3.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5H2.545c-.3 0-.545.224-.545.5zm6.5 5a.5.5 0 0 0-1 0V10H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V11H10a.5.5 0 0 0 0-1H8.5V8.5z" />
                </svg>
                {time} Uhr
              </button>

              {loc && (
                <Link
                  to={loc}
                  className="inline-flex items-center gap-1.5 hover:text-orange-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                  </svg>
                  <span className="truncate max-w-[200px]">
                    {event["location"]?.split(",")[0]}
                  </span>
                </Link>
              )}
            </div>

            <p
              className={`text-sm leading-relaxed ${isFinished ? "text-gray-400" : "text-gray-600"}`}
            >
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
            <Link
              to={event["url"]}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              {!event["url"].includes("gewinnspiel")
                ? "🎟️ Anmelden"
                : "🎁 Teilnehmen"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
            </Link>
            <button
              onClick={() => download("event.ics", content || "")}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              📅 Zum Kalender
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPast, setShowPast] = useState<boolean>(false);
  const [highlightedId, setHighlightedId] = React.useState<number | null>(null);
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

      element.scrollIntoView({ behavior: "smooth", block: "center" });
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

  // Count upcoming events
  const upcomingCount = events.filter(
    (e) => ConvertDateObject(e.start) >= new Date()
  ).length;
  const pastCount = events.filter(
    (e) => ConvertDateObject(e.start) < new Date()
  ).length;

  return (
    <Layout>
      <div className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
        <h2 className="mb-16 text-3xl font-bold text-center">
          Unsere{" "}
          <span className="text-primary dark:text-primary-400 no-underline">
            Events
          </span>
        </h2>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-amber-200 rounded-full filter blur-3xl opacity-30 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-yellow-200 rounded-full filter blur-3xl opacity-20"></div>

        <div className="relative z-10 container max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-full mb-6 shadow-xl ring-4 ring-orange-100">
              <span className="text-4xl">🎉</span>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Entdecke unsere kommenden Events und werde Teil unserer
              Gemeinschaft!
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-md border border-white/50">
                <span className="text-2xl font-bold text-orange-600">
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border border-white/50">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl">🔍</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Filter & Suche
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Suche
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
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
                    type="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white text-gray-700 placeholder-gray-400 outline-none"
                    placeholder="Nach Event suchen..."
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Von
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white text-gray-700 outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Bis
                </label>
                <input
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
                  type="checkbox"
                  checked={showPast}
                  onChange={(e) => setShowPast(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                <span className="ms-3 text-sm font-medium text-gray-600">
                  Vergangene Events anzeigen
                </span>
              </label>

              {(searchTerm || startDate || endDate) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
                >
                  <svg
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
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
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
                <EventCard key={index} event={e} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <span className="text-4xl">📭</span>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                Keine Events gefunden
              </h3>
              <p className="text-gray-500 mb-6">
                Versuche andere Suchbegriffe oder passe die Filter an.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStartDate("");
                  setEndDate("");
                  setShowPast(true);
                }}
                className="inline-flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium px-5 py-2.5 rounded-xl transition-colors"
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

export const Head: HeadFC = () => <title>Kinderlicht</title>;
