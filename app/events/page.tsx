"use client";

import Link from "next/link";
import events from "./events.json";
import React, { useEffect } from "react";

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Event(event: JSON) {
  const ics = require("ics");
  const icsFile = ics.createEvent(events[0]);
  let content = "Ups da ist etwas schief gelaufen...";
  if (icsFile["error"] != null) {
    content = icsFile["value"];
  }
  const prettyDate = new Date(...event["start"]);
  const dateString = prettyDate.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const loc =
    "https://www.google.com/maps/search/?api=1&query=" +
    event["geo"]["lat"] +
    "," +
    event["geo"]["lon"];
  return (
    <div className="flex flex-col md:flex-row md:justify-between hover:">
      <div className="mb-4 md:mb-0 w-5/12">
        <h3 className="text-xl font-bold mb-2 ">{event["title"]}</h3>
        <p>
        <Link
          className="text-sm text-blue-600"
          onClick={() => download("event.ics", content)}
          href="#"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="inline-block bi bi-calendar2-plus-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 3.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5H2.545c-.3 0-.545.224-.545.5zm6.5 5a.5.5 0 0 0-1 0V10H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V11H10a.5.5 0 0 0 0-1H8.5V8.5z" />
          </svg>{" "}
          Datum: {dateString}{" "}
        </Link>
        </p>
        <a href={loc} className="text-blue-600 text-sm hover:no-underline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="inline-block bi bi-geo-alt-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>{" "}
          {event["location"]}
        </a>
      </div>
      <p className="text-gray-700 w-7/12">{event["description"]}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto mb-8 mt-32">
      <h2 className="mb-16 text-3xl font-bold text-center">
        Unsere{" "}
        <u className="text-primary dark:text-primary-400">Veranstaltungen</u>
      </h2>
      <div className="border-l-2 border-gray-500 pl-8">{Event(events[0])}</div>
    </div>
  );
}
