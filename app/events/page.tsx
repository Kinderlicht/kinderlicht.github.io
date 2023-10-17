"use client";

import Link from "next/link";
import { events, Event } from "@/app/_data/events";
import React, { useState } from "react";
import { createEvent } from "ics";

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ConvertDate(date: number[]) {
  const d = ConvertDateObject(date);
  return (
    d.toLocaleDateString("de", {
      timeZone: "CET",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) +
    " um " +
    d.toLocaleTimeString("de", {
      timeZone: "CET",
      hour: "2-digit",
      minute: "2-digit",
    }) +
    " Uhr"
  );
}

function ConvertDateObject(date: number[]): Date {
  let mapped = date.map((num: number) => {
    if (num < 10) {
      return "0" + num;
    }
    return num + "";
  });

  return new Date(
    mapped[0] +
      "-" +
      mapped[1] +
      "-" +
      mapped[2] +
      "T" +
      mapped[3] +
      ":" +
      mapped[4] +
      ":00"
  );
}

function Event(event: Event, index: number) {
  const icsFile = createEvent(event);
  let content : string | undefined = "Ups, da ist etwas schief gelaufen...";
  if (icsFile["error"] == null) {
    content = icsFile["value"];
  } else {
    console.log(icsFile["error"]);
  }
  const loc = event["geo"] &&
    `https://www.google.com/maps/search/?api=1&query=${event["geo"]["lat"]},${event["geo"]["lon"]}`;
  let eventDate = ConvertDateObject(event["start"]);
  let currentDate = new Date();
  let additional = "";
  if (eventDate < currentDate) {
    additional = " (abgeschlossen)";
  }
  return (
    <div key={index} className="flex flex-col md:flex-row md:justify-between my-8">
      <div className="mb-4 md:mb-0 w-5/12">
        <h3 className="text-xl font-bold mb-2 ">
          {event["title"] + additional}
        </h3>
        <p>
          <Link
            className="text-sm text-blue-600"
            onClick={() => download("event.ics", content || "")}
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
            {ConvertDate(event["start"])}{" "}
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
      <p
        className="text-gray-700 w-7/12"
        dangerouslySetInnerHTML={{ __html: event["description"] || "" }}
      />
    </div>
  );
}

export default function Home() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  let filtered = events.filter((e) => {
    if (searchTerm !== "") {
      if (!e.description?.includes(searchTerm)) return false;
    }

    if (startDate !== "") {
      const startDateDate = new Date(startDate);
      const eventStartDate = ConvertDateObject(e.start);

      if (eventStartDate < startDateDate) return false;
    }

    if (endDate !== "") {
      const endDateDate = new Date(endDate);
      const eventEndDate = ConvertDateObject(e.start); // Events don't last longer than 24 hours, probably. Otherwise: Fuck you

      if (eventEndDate > endDateDate) return false;
    }

    return true;
  });

  return (
    <div className="max-w-5xl mx-auto mb-8 mt-32">
      <h2 className="mb-16 text-3xl font-bold text-center">
        Unsere{" "}
        <u className="text-primary dark:text-primary-400">Veranstaltungen</u>
      </h2>
      <div className="flex content-center grid-cols-3 mb-8">
        <div className="w-6/12 mr-8">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Suchen
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
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
              onChange={(str) => {
                setSearchTerm(str.target.value);
              }}
              value={searchTerm}
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Gib einen Begriff ein..."
            />
          </div>
        </div>
        <div className="flex items-center w-5/12">
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <span className="mx-4 text-gray-500">bis</span>
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              type="date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="border-l-2 border-gray-500 pl-8">
        {/* {startDate} bis {endDate} */}
        {filtered.map((e, index) => Event(e, index))}
      </div>
    </div>
  );
}
