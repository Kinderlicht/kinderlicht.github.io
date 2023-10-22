"use client";

import Link from "next/link";
import {
  NewsItem,
  news_data,
  ConvertDate,
  NewsItemLink,
} from "@/app/_data/news";
import { Author, authors } from "@/app/_data/authors";

function CountWords(str: string) {
  return str.trim().split(/\s+/).length;
}

function GetImageOrVideo(news: NewsItem, isRecommended: boolean = false) {
  let recommended = isRecommended ? "object-cover w-full rounded h-44 dark:bg-gray-500" : "object-cover w-full mb-8 rounded lg:col-span-7 dark:bg-gray-500";
  if (!isRecommended) {
    recommended += " h-64 sm:h-96";
  } 
  const isYoutube = news["image"].includes("youtub");
  return (
    <>
      {isYoutube ? (
        <iframe
          className={recommended}
          src={news["image"]}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={news["heading"]}
        />
      ) : (
        <img
          role="presentation"
          className={recommended}
          src={news["image"]}
          alt={news["heading"]}
        />
      )}
    </>
  );
}

function RecommendArticle(item: NewsItem | undefined) {
  if (item === undefined) {
    return [];
  }
  let entries = [];
   for (let i = 0; i < news_data.length; i++) {
     let entry = news_data[i];
     if (entry == item) {
       continue;
     }
     const intersection = item["keywords"].filter((value) =>
       entry["keywords"].includes(value)
     );
     entries.push([i, intersection.length]);
   }
   entries.sort((a, b) => b[1] - a[1]);
   let recommended = [];
   for (let i = 0; i < Math.min(4, entries.length); i++) {
     recommended.push(news_data[entries[i][0]]);
   }
   return recommended;
}

function RecommendedArticle(recommended: NewsItem) {
  let link = NewsItemLink(recommended);

  let minutes = Math.max(
    1,
    Math.floor(CountWords(recommended["content"]) / 180)
  );
  let minutesText = "Minute";
  if (minutes > 1) {
    minutesText += "n";
  }
  return (
    <article className="max-w-xs">
      <Link href={link} className="hover:underline">
      {GetImageOrVideo(recommended, true)}
      <h2 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white mt-4">
        <a href="#">{recommended["heading"]}</a>
      </h2>
      <p
        className="mb-4  text-gray-500 dark:text-gray-400"
        dangerouslySetInnerHTML={{ __html: recommended["short"] }}
      />
      <a
        href="#"
        className="inline-flex items-center font-medium underline-offset-4 text-primary-600 dark:text-primary-500"
      >
        {minutes} {minutesText} Lesezeit
      </a>
      </Link>
    </article>
  );
}

const Home = ({ params: { slug } }: { params: { slug: string } }) => {
  const item = news_data.find((e) => e.slug == slug);
  const author = item ? authors[item["author"]] : undefined;
  const recommended = RecommendArticle(item);
  return (
    <>
      {item === undefined ? (
        <p>Artikel wurde nicht gefunden</p>
      ) : (
        <>
          <section>
            <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
              <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                  <header className="mb-4 lg:mb-6 not-format">
                    {author && (
                      <address className="flex items-center mb-6 not-italic">
                        <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                          <img
                            className="mr-4 h-16 rounded-full"
                            src={author.image}
                            alt={author.name}
                          ></img>
                          <div>
                            <a
                              href="#"
                              rel="author"
                              className="text-xl font-bold text-gray-900 dark:text-white"
                            >
                              {author.name}
                            </a>
                            <p className="text-base text-gray-500 dark:text-gray-400">
                              {author.description}
                            </p>
                            <p className="text-base text-gray-500 dark:text-gray-400">
                              <time>{ConvertDate(item["date"])}</time>
                            </p>
                          </div>
                        </div>
                      </address>
                    )}
                    <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                      {item["heading"]}
                    </h1>
                  </header>
                  {GetImageOrVideo(item)}
                  <p
                    className="text-justify"
                    dangerouslySetInnerHTML={{ __html: item["content"] }}
                  />
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
        </>
      )}
    </>
  );
};

export default Home;