import Link from "next/link";

// component for links
function HistoryLink(
  title: string,
  short: string,
  description: string,
  link: string,
  visual: string,
  size: number
) {
  return (
    <Link href={link} className={`w-full xl:w-1/${size} p-4`}>
      <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
        {visual.indexOf("youtube") > -1 ? (
          <iframe
            className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
            src={visual}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={short}
          />
        ) : (
          <img
            className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
            src={visual}
            alt={short}
          />
        )}
        <h3 className="tracking-widest text-primary text-xs font-medium title-font">
          {short}
        </h3>
        <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
          {title}
        </h2>
        <p className="leading-relaxed text-base">{description}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto max-w-7x1">
          <div className="flex flex-wrap w-full mb-4 p-4">
            <div className="w-full mb-6 lg:mb-0">
              <h2 className="text-3xl font-bold">
                Kinderlicht Wallersdorf{" "}
                <u className="text-primary dark:text-primary-400 no-underline">
                  e. V.
                </u>
              </h2>
              <div className="h-1 w-20 bg-primary rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            {HistoryLink(
              "Ich suche Hilfe!",
              "Melde dich bei uns, wir helfen gerne!",
              "Der Kinderlicht Wallersdorf e.V. konnte bereits vielen Familien erfolgreich helfen.",
              "/anfrage",
              "/home/help.png",
              3
            )}
            {HistoryLink(
              "Ich möchte helfen!",
              "Spenden oder Beitreten",
              "Für Menschen, die sich engagieren oder uns einfach finanziell unterstützen wollen!",
              "/beitreten",
              "/home/donate.png",
              3
            )}
            {HistoryLink(
              "Ankündigungen und Neuigkeiten",
              "Unsere News",
              "Hier kannst du jeden unserer Schritte verfolgen!",
              "/neues",
              "/home/news.png",
              3
            )}
          </div>
        </div>
      </section>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto max-w-7x1">
          <div className="flex flex-wrap w-full mb-4 p-4">
            <div className="w-full mb-6 lg:mb-0">
              <h2 className="text-3xl font-bold">
                Unsere{" "}
                <u className="text-primary dark:text-primary-400 no-underline">
                  Geschichte
                </u>
              </h2>
              <div className="h-1 w-20 bg-primary rounded"></div>
            </div>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2018</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            {HistoryLink(
              "Die Anfänge",
              "Wie alles begann",
              "Schon vor der Grüdung waren viele Mitglieder beim Lichterhaus Wallersdorf aktiv. Dabei wurden Spenden für die Krebshilfe gesammelt.",
              "/neues/wie-alles-begann",
              "/home/start.jpg",
              2
            )}
            {HistoryLink(
              "Der Kinderlicht Wallersdorf e.V.",
              "Die Grüdung",
              "Sieben engagierte Mitglieder gründen den Verein im Oktober 2018.",
              "/neues/wie-alles-begann",
              "/home/founding.jpg",
              2
            )}
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2019</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            {HistoryLink(
              "Florian Pronold übernimmt die Schirmherrschaft",
              "Schirmherrschaft",
              "Schnell war auch ein prominenter Schirmherr aus dem Bundestag gefunden: Florian Pronold.",
              "/neues/schirmherrschaft",
              "/home/umbrella.jpg",
              3
            )}
            {HistoryLink(
              "Rennen auf dem Nürburgring",
              "Gemeinsam ans Ziel",
              "Innerhalb eines Jahres konnten wir mehreren betroffenen Familien gemeinsam mit der VKKK ein Wochenende auf dem Nürburgring ermöglichen.",
              "https://www.youtube.com/embed/FjgCtdiizUY?si=fIZhSdl5d-02NIQv&amp;controls=0",
              "https://www.youtube.com/embed/FjgCtdiizUY?si=fIZhSdl5d-02NIQv&amp;controls=0",
              3
            )}
            {HistoryLink(
              "Lasershow durch Crowdfunding",
              "Lasershow",
              "Wenig später gab es schon das nächste - im wahrsten Sinne des Wortes - Highlight: Durch Crowdfunding konnten wir eine umweltschonende Lasershow organisieren.",
              "/neues/lasershow-premiere-in-wallersdorf",
              "/home/fireworks.jpg",
              3
            )}
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2020</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            {HistoryLink(
              "Konzert der Filmmusik",
              "Unterhaltung",
              "Auch kulturell kann der Kinderlicht Wallersdorf e.V. einiges bieten: noch vor der Pandemie organisiert der Verein ein Konzert der Filmmusik mit 80 MusikerInnen.",
              "/neues/eine-musikalische-reise-durch-die-welt-der-filmmusik",
              "/home/music.jpg",
              2
            )}
            {HistoryLink(
              "Spenden an zwei Familien",
              "Hohe Spenden",
              "Der Kinderlicht Wallersdorf. e.V. spendet in diesem Jahr insgesamt 4000€ an zwei Familien. Unter anderem wird ein Auto mitfinanziert.",
              "/neues/einen-beitrag-zum-auto-geleistet",
              "/home/car.jpg",
              2
            )}
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2021</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            {HistoryLink(
              "Kinderlicht in Krisenzeiten",
              "Corona Krise",
              "Auch während der Kirsenzeiten konnten wir einige Spenden sammeln und so weiterhelfen.",
              "/neues/masken-fuer-ein-kinderlaecheln",
              "/home/corona.jpg",
              3
            )}
            {HistoryLink(
              "Ferienprogramm",
              "3 Tage im Mittelalter",
              "In unserem zweiten Ferienprogramm, nahmen wir die TeilnehmerInnen auf eine dreitägige Reise durch die Zeit ins Mittelalter mit.",
              "https://www.youtube.com/embed/AkCsF4e41JI?si=ZYmi62akER48yqNr&amp;controls=0",
              "https://www.youtube.com/embed/AkCsF4e41JI?si=ZYmi62akER48yqNr&amp;controls=0",
              3
            )}
            {HistoryLink(
              "24 Tage Livestreams",
              "#Krippalkalender",
              "Für eine großangelegte Spendenaktion haben wir an 24 Tagen in Folge eigens produzierte Inhlate gestreamt. Es konnten 3346€ gesammelt werden.",
              "https://www.youtube.com/embed/bGR75Cy2BrU?si=CN-bjRy-gWQdhQ9Y&amp;controls=0",
              "https://www.youtube.com/embed/bGR75Cy2BrU?si=CN-bjRy-gWQdhQ9Y&amp;controls=0",
              3
            )}
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2022</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            {HistoryLink(
              "Mehr Spenden und Renovierungen",
              "Anpacken!",
              "Auch in 2022 konnten wir viele Spenden verteilen und haben neben einer Wohnungsrenovierung auch ein Hochbeet für einen Kindergarten gebaut.",
              "/neues/ab-ins-beet",
              "/home/hochbeet.jpg",
              2
            )}
            {HistoryLink(
              "Die vier Jahreszeiten",
              "Kinofilm",
              "Auch unsere FilmemacherInnen haben nicht geschlafen und einen Kinofilm produziert. Kann der Weihnachtswichtel die &quot;4 Jahreszeiten&quot; von der bösen Hexe befreien?",
              "https://www.youtube.com/embed/ZRj34XeuHCY?si=-6323dPZhhbgEPjS&amp;controls=0",
              "https://www.youtube.com/embed/ZRj34XeuHCY?si=-6323dPZhhbgEPjS&amp;controls=0",
              2
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
