import Link from "next/link";
import {
  NewsItem,
  news_data,
  NewsItemLink,
  ConvertDate,
} from "@/app/_data/news";

function NewsEntry(news: NewsItem, index: number) {
  const link = NewsItemLink(news);

  return (
    <Link
      rel="noopener noreferrer"
      href={link}
      className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:bg-gray-900"
      key={index}
    >
      <img
        role="presentation"
        className="object-cover w-full rounded h-44 dark:bg-gray-500"
        src={news["image"]}
      />
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

function TopEntry(news: NewsItem) {
  let link = NewsItemLink(news);
  return (
    <Link
      rel="noopener noreferrer"
      href={link}
      className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:bg-gray-900"
    >
      <img
        src={news["image"]}
        alt=""
        className="object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 dark:bg-gray-500"
      />
      <div className="p-6 space-y-2 lg:col-span-5">
        <h3 className="text-2xl font-semibold sm:text-4xl group-hover:underline group-focus:underline">
          {news["heading"]}
        </h3>
        <span className="text-xs dark:text-gray-400">
          {ConvertDate(news["date"])}
        </span>
        <p dangerouslySetInnerHTML={{ __html: news["short"] }} />
        <p className="text-justify">
          {news["content"].replace(/<[^>]*>/g, "").substring(0, 400) + "..."}
        </p>
      </div>
    </Link>
  );
}

export default function Home() {
  let recent = news_data[0];
  let remaining = news_data.slice(1);
  return (
    <section className="dark:bg-gray-800 dark:text-gray-100 my-24">
      <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
        <h2 className="mb-16 text-3xl font-bold text-center">
          Unsere{" "}
          <u className="text-primary dark:text-primary-40">Neuigkeiten</u>
        </h2>
        {TopEntry(recent)}
        <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((entry, index) => NewsEntry(entry, index))}
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="px-6 py-3 text-sm rounded-md hover:underline dark:bg-gray-900 dark:text-gray-400"
          >
            Load more posts...
          </button>
        </div>
      </div>
    </section>
  );
}
