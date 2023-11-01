import * as React from "react";
import { HeadFC, PageProps, Link } from "gatsby";
import Layout from "../components/layout";
import { GatsbyImage, StaticImage, getImage } from "gatsby-plugin-image";

// component for links
function HistoryLink({
  title,
  short,
  description,
  link,
  visual,
  size,
}: {
  title: string;
  short: string;
  description: string;
  link: string;
  visual: string | React.ReactNode;
  size: number;
}) {
  const width = size === 1 ? "w-full" : size === 2 ? "w-1/2" : "w-1/3";
  return (
    <Link to={link} className={`w-full md:${width} p-4`}>
      <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
        {typeof visual === "string" ? (
          <iframe
            className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
            src={visual}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={short}
          />
        ) : (
          <>{visual}</>
          //
          // />
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

export default function IndexPage() {
  return (
    <Layout>
      <div>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto max-w-7x1">
            <div className="flex flex-wrap w-full mb-4 p-4">
              <div className="w-full mb-6 lg:mb-0">
                <h2 className="text-3xl font-bold">
                  Kinderlicht Wallersdorf{" "}
                  <span className="text-primary dark:text-primary-400 no-underline">
                    e. V.
                  </span>
                </h2>
                <div className="h-1 w-20 bg-primary rounded"></div>
              </div>
            </div>
            <div className="flex flex-wrap -m-4">
              <HistoryLink
                title="Ich suche Hilfe!"
                description="Der Kinderlicht Wallersdorf e.V. konnte bereits vielen Familien erfolgreich helfen."
                short="Melde dich bei uns, wir helfen gerne!"
                link="/anfrage"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src={"../images/home/help.png"}
                    alt={"Melde dich bei uns, wir helfen gerne!"}
                  />
                }
                size={3}
              />
              <HistoryLink
                title="Ich möchte helfen!"
                description="Für Menschen, die sich engagieren oder uns einfach finanziell unterstützen wollen!"
                short="Spenden oder Beitreten"
                link="/beitreten"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src={"../images/home/donate.png"}
                    alt={"Spenden oder Beitreten"}
                  />
                }
                size={3}
              />
              <HistoryLink
                title="Ankündigungen und Neuigkeiten"
                description="Hier kannst du jeden unserer Schritte verfolgen!"
                short="Unsere News"
                link="/neues"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/news.png"
                    alt="Unsere News"
                  />
                }
                size={3}
              />
            </div>
          </div>
        </section>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto max-w-7x1">
            <div className="flex flex-wrap w-full mb-4 p-4">
              <div className="w-full mb-6 lg:mb-0">
                <h2 className="text-3xl font-bold">
                  Unsere{" "}
                  <span className="text-primary dark:text-primary-400 no-underline">
                    Geschichte
                  </span>
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
              <HistoryLink
                title="Die Anfänge"
                description="Schon vor der Gründung waren viele Mitglieder beim Lichterhaus Wallersdorf aktiv. Dabei wurden Spenden für die Krebshilfe gesammelt."
                short="Wie alles begann"
                link="/neues/wie-alles-begann"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/start.jpg"
                    alt="Wie alles begann"
                  />
                }
                size={2}
              />
              <HistoryLink
                title="Der Kinderlicht Wallersdorf e.V."
                description="Sieben engagierte Mitglieder gründen den Verein im Oktober 2018."
                short="Die Gründung"
                link="/neues/die-gruendung"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/founding.jpg"
                    alt="Die Gründung"
                  />
                }
                size={2}
              />
            </div>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">2019</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="flex flex-wrap -m-4">
              <HistoryLink
                title="Florian Pronold übernimmt die Schirmherrschaft"
                description="Schnell war auch ein prominenter Schirmherr aus dem Bundestag gefunden: Florian Pronold."
                short="Schirmherrschaft"
                link="/neues/schirmherrschaft"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/umbrella.jpg"
                    alt="Schirmherrschaft"
                  />
                }
                size={3}
              />
              <HistoryLink
                title="Rennen auf dem Nürburgring"
                description="Innerhalb eines Jahres konnten wir mehreren betroffenen Familien gemeinsam mit der VKKK ein Wochenende auf dem Nürburgring ermöglichen."
                short="Gemeinsam ans Ziel"
                link="https://www.youtube.com/embed/FjgCtdiizUY?si=fIZhSdl5d-02NIQv&amp;controls=0"
                visual="https://www.youtube.com/embed/FjgCtdiizUY?si=fIZhSdl5d-02NIQv&amp;controls=0"
                size={3}
              />
              <HistoryLink
                title="Lasershow durch Crowdfunding"
                description="Wenig später gab es schon das nächste - im wahrsten Sinne des Wortes - Highlight: Durch Crowdfunding konnten wir eine umweltschonende Lasershow organisieren."
                short="Lasershow"
                link="/neues/lasershow-premiere-in-wallersdorf"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/fireworks.jpg"
                    alt="Lasershow"
                  />
                }
                size={3}
              />
            </div>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">2020</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="flex flex-wrap -m-4">
              <HistoryLink
                title="Konzert der Filmmusik"
                description="Auch kulturell kann der Kinderlicht Wallersdorf e.V. einiges bieten: noch vor der Pandemie organisiert der Verein ein Konzert der Filmmusik mit 80 MusikerInnen."
                short="Unterhaltung"
                link="/neues/eine-musikalische-reise-durch-die-welt-der-filmmusik"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/music.jpg"
                    alt="Unterhaltung"
                  />
                }
                size={2}
              />
              <HistoryLink
                title="Spenden an zwei Familien"
                description="Der Kinderlicht Wallersdorf. e.V. spendet in diesem Jahr insgesamt 4000€ an zwei Familien. Unter anderem wird ein Auto mitfinanziert."
                short="Hohe Spenden"
                link="/neues/einen-beitrag-zum-auto-geleistet"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/car.jpg"
                    alt="Hohe Spenden"
                  />
                }
                size={2}
              />
            </div>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">2021</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="flex flex-wrap -m-4">
              <HistoryLink
                title="Kinderlicht in Krisenzeiten"
                description="Auch während der Krisenzeiten konnten wir einige Spenden sammeln und so weiterhelfen."
                short="Corona Krise"
                link="/neues/masken-fuer-ein-kinderlaecheln"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/corona.jpg"
                    alt="Corona Krise"
                  />
                }
                size={3}
              />
              <HistoryLink
                title="Ferienprogramm"
                description="In unserem zweiten Ferienprogramm, nahmen wir die TeilnehmerInnen auf eine dreitägige Reise durch die Zeit ins Mittelalter mit."
                short="3 Tage im Mittelalter"
                link="https://www.youtube.com/embed/AkCsF4e41JI?si=ZYmi62akER48yqNr&amp;controls=0"
                visual="https://www.youtube.com/embed/AkCsF4e41JI?si=ZYmi62akER48yqNr&amp;controls=0"
                size={3}
              />
              <HistoryLink
                title="24 Tage Livestreams"
                description="Für eine großangelegte Spendenaktion haben wir an 24 Tagen in Folge eigens produzierte Inhalte gestreamt. Es konnten 3346€ gesammelt werden."
                short="#Krippalkalender"
                link="https://www.youtube.com/embed/bGR75Cy2BrU?si=CN-bjRy-gWQdhQ9Y&amp;controls=0"
                visual="https://www.youtube.com/embed/bGR75Cy2BrU?si=CN-bjRy-gWQdhQ9Y&amp;controls=0"
                size={3}
              />
            </div>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">2022</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="flex flex-wrap -m-4">
              <HistoryLink
                title="Mehr Spenden und Renovierungen"
                description="Auch in 2022 konnten wir viele Spenden verteilen und haben neben einer Wohnungsrenovierung auch ein Hochbeet für einen Kindergarten gebaut."
                short="Anpacken!"
                link="/neues/ab-ins-beet"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/hochbeet.jpg"
                    alt="Anpacken!"
                  />
                }
                size={2}
              />
              <HistoryLink
                title="Die vier Jahreszeiten"
                description='Auch unsere FilmemacherInnen haben nicht geschlafen und einen Kinofilm produziert. Kann der Weihnachtswichtel die "4 Jahreszeiten" von der bösen Hexe befreien?'
                short="Kinofilm"
                link="https://www.youtube.com/embed/ZRj34XeuHCY?si=-6323dPZhhbgEPjS&amp;controls=0"
                visual="https://www.youtube.com/embed/ZRj34XeuHCY?si=-6323dPZhhbgEPjS&amp;controls=0"
                size={2}
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => <title>Home Page</title>;
