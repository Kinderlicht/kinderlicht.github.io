"use client";

import { useSearchParams } from "next/navigation";
import data from "../news.json";
import authors from "../author.json";
import ReactHtmlParser from "react-html-parser";

function countWords(str: string) {
  return str.trim().split(/\s+/).length;
}

function RecommendedArticle(recommended: JSON) {
  let link =
    "/news/beitrag?id=" +
    recommended["date"].replace(" ", "-") +
    "-" +
    recommended["heading"].replace(" ", "-");
  let minutes = Math.max(
    1,
    Math.floor(countWords(recommended["content"]) / 220)
  );
  let minutesText = "Minute";
  if (minutes > 1) {
    minutesText += "n";
  }
  return (
    <article className="max-w-xs">
      <a href={link}>
        <img
          src={recommended["image"]}
          className="mb-5 rounded-lg"
          alt={recommended["heading"]}
        ></img>
      </a>
      <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
        <a href="#">{recommended["heading"]}</a>
      </h2>
      <p className="mb-4  text-gray-500 dark:text-gray-400">
        {ReactHtmlParser(recommended["short"])}
      </p>
      <a
        href="#"
        className="inline-flex items-center font-medium underline underline-offset-4 text-primary-600 dark:text-primary-500 hover:no-underline"
      >
        {minutes} {minutesText} Lesezeit
      </a>
    </article>
  );
}

export default function Home() {
  const queryParams = useSearchParams();
  const id = queryParams.get("id");
  let show = null;
  let error = [];
  for (let entry of data) {
    let entry_id =
      entry["date"].replace(" ", "-") +
      "-" +
      entry["heading"].replace(" ", "-");
    if (entry_id == id) {
      show = entry;
      break;
    }
    if (error.length < 4) {
      error.push(entry);
    }
  }
  if (show == null) {
    return (
      <div>
        <aside
          aria-label="Empfohlene Artikel"
          className="py-8 lg:py-24 bg-gray-50 dark:bg-gray-800"
        >
          <div className="px-4 mx-auto max-w-screen-xl">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
              Wir haben den Artikel leider nicht gefunden, versuchs doch mal
              mit...
            </h2>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {error.map((entry) => RecommendedArticle(entry))}
            </div>
          </div>
        </aside>
      </div>
    );
  }
  let author = authors[show["author"]];
  let entries = [];
  for (let i = 0; i < data.length; i++) {
    let entry = data[i];
    if (entry == show) {
      continue;
    }
    const intersection = show["keywords"].filter((value) =>
      entry["keywords"].includes(value)
    );
    entries.push([i, intersection.length]);
  }
  entries.sort((a, b) => b[1] - a[1]);
  let recommended = [];
  for (let i = 0; i < Math.min(4, entries.length); i++) {
    recommended.push(data[entries[i][0]]);
  }

  return (
    <section>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
          <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <header className="mb-4 lg:mb-6 not-format">
              <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                  <img
                    className="mr-4 h-16 rounded-full"
                    src={author["image"]}
                    alt={author["name"]}
                  ></img>
                  <div>
                    <a
                      href="#"
                      rel="author"
                      className="text-xl font-bold text-gray-900 dark:text-white"
                    >
                      {author["name"]}
                    </a>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      {author["description"]}
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      <time>{show["date"]}</time>
                    </p>
                  </div>
                </div>
              </address>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                {show["heading"]}
              </h1>
            </header>
            <img
              src={show["image"]}
              alt=""
              className="object-cover w-full h-64 mb-8 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500"
            />
            <p>{ReactHtmlParser(show["content"])}</p>
          </article>
        </div>
      </main>

      <aside
        aria-label="Empfohlene Artikel"
        className="py-8 lg:py-24 bg-gray-50 dark:bg-gray-800"
      >
        <div className="px-4 mx-auto max-w-screen-xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Empfohlene Artikel basierend auf diesem Artikel
          </h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((entry) => RecommendedArticle(entry))}
          </div>
        </div>
      </aside>
    </section>
  );
}
