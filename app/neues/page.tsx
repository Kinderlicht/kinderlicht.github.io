"use client";

import Link from "next/link";
import {
  NewsItem,
  news_data,
  NewsItemLink,
  ConvertDate,
} from "@/app/_data/news";
import { useState } from "react";

function NewsEntry(news: NewsItem, index: number) {
  const link = NewsItemLink(news);

  return (
    <Link
      rel="noopener noreferrer"
      href={link}
      className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-900 bg-gray-200 rounded-xl w-full"
      key={index}
    >
      {GetImageOrVideo(news, false)}
      <div className="p-6 space-y-2">
        <h3 className="text-2xl font-semibold group-hover:underline group-focus:underline">
          {news["heading"]}
        </h3>
        <span className="text-xs dark:text-gray-400">
          {ConvertDate(news["date"])}
        </span>
        <p dangerouslySetInnerHTML={{ __html: news["short"] }} />
      </div>
    </Link>
  );
}

function GetImageOrVideo(news: NewsItem, isTop: boolean) {
  let isYoutube = news["image"].includes("youtub");
  const className = isTop
    ? "object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500"
    : "object-cover w-full rounded h-44 dark:bg-gray-500";
  return (
    <>
      {isYoutube ? (
        <iframe
          className={className}
          src={news["image"]}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={news["heading"]}
        />
      ) : (
        <img
          role="presentation"
          className={className}
          src={news["image"]}
          alt={news["heading"]}
        />
      )}
    </>
  );
}

function TopEntry(news: NewsItem) {
  let link = NewsItemLink(news);
  return (
    <Link
      rel="noopener noreferrer"
      href={link}
      className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-900 bg-gray-200 rounded-xl"
    >
      {GetImageOrVideo(news, true)}
      <div className="p-6 space-y-2 lg:col-span-5">
        <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">
          {news["heading"]}
        </h3>
        <span className="text-xs dark:text-gray-400">
          {ConvertDate(news["date"])}
        </span>
        <p dangerouslySetInnerHTML={{ __html: news["short"] }} />
        <p className="text-justify text-ellipsis overflow-hidden whitespace-nowrap">
          {news["content"].replace(/<[^>]*>/g, "")}
        </p>
      </div>
    </Link>
  );
}

export default function Home() {
  const revealArticles = 6;
  let [end, setEnd] = useState<number>(1 + revealArticles);
  let removeButton = end >= news_data.length - 1;

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  console.log(searchTerm);

  let filtered = news_data.filter((e) => {
    if (searchTerm !== "") {
      if (
        !e.content?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !e.short?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !e.keywords?.join(" ").includes(searchTerm.toLowerCase())
      )
        return false;
    }

    if (startDate !== "") {
      const startDateDate = new Date(startDate);
      const eventStartDate = e.date;

      if (eventStartDate < startDateDate) return false;
    }

    if (endDate !== "") {
      const endDateDate = new Date(endDate);
      const eventEndDate = e.date;

      if (eventEndDate > endDateDate) return false;
    }

    return true;
  });

  filtered = filtered.sort((a, b) => b["date"].getTime() - a["date"].getTime());

  let remaining = filtered.slice(1, end);
  let recent = filtered[0];

  return (
      <div className="container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
      <h2 className="mb-16 text-3xl font-bold text-center">
        Unsere{" "}
        <u className="text-primary dark:text-primary-400 no-underline">Neuigkeiten</u>
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
        {recent ? (
          TopEntry(recent)
        ) : (
          <div
            className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
            role="alert"
          >
            <p className="font-bold">Keinen Artikel gefunden.</p>
            <p className="text-sm">
              Leider konnten wir keinen Artikel finden, der zu den angegebenen
              Suchkriterien passt.
            </p>
          </div>
        )}
        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((entry, index) => NewsEntry(entry, index))}
        </div>
        {removeButton ? (
          <></>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400 italic"
              onClick={(_) => setEnd(end + revealArticles)}
            >
              Mehr anzeigen...
            </button>
          </div>
        )}
      </div>
  );
}
