
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

function EventView(event: Event, index: number) {
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
  let additional = <></>;
  let finished = false;
  if (eventDate < currentDate) {
    additional = (
      <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
        Abgeschlossen
      </span>
    );
    finished = true;
  } else if (
    eventDate > currentDate &&
    eventDate.getTime() - currentDate.getTime() < eventIsSoon
  ) {
    additional = (
      <>
        <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
          Bevorstehend
        </span>
        {event["url"] && (
          <Link
            to={event["url"]}
            className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            Anmelden{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="inline-block bi bi-box-arrow-up-right ml-1"
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
        )}
      </>
    );
  }
  return (
    <div key={index} className={(finished ? "bg-gray-200 text-gray-500 child:text-gray-200 child:select-none" : "bg-white dark:bg-neutral-700 hover:bg-gray-100") + " block rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-full h-ful p-8"}>
      <h3 className="text-xl font-bold mb-2 w-full">
        {event["title"]} {additional}
      </h3>
      <p>
        <Link
          className="text-sm text-blue-600"
          onClick={() => download("event.ics", content || "")}
          to="#"
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
      <p>
        <Link
          to={loc || "#"}
          className="text-blue-600 text-sm hover:no-underline w-full"
        >
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
        </Link>
      </p>
      <p className="flex-col mt-2">
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
  );
}

export default function EventPage() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  let filtered = events.filter((e) => {
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
      const eventEndDate = ConvertDateObject(e.start); // Events don't last longer than 24 hours, probably. Otherwise: Fuck you

      if (eventEndDate > endDateDate) return false;
    }

    return true;
  });

  return (
    <Layout>
    <div className="p-4 container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-10 mt-32">
      <h2 className="mb-16 text-3xl font-bold text-center">
        Unsere{" "}
        <span className="text-primary dark:text-primary-400 no-underline">
          Veranstaltungen
        </span>
      </h2>
      <div className="w-full mb-4">
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Gib einen Begriff ein..."
          />
        </div>
      </div>
      <div className="flex items-center w-full">
        <div className="relative w-1/2">
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
        <div className="relative w-1/2">
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
      <div className="border-l-2 border-gray-500 pl-8 mt-8 space-y-2">
        {filtered.map((e, index) => EventView(e, index))}
      </div>
    </div>
    </Layout>
  );
}

export const Head: HeadFC = () => <title>Kinderlicht</title>;