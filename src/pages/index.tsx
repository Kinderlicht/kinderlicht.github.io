import * as React from "react";
import { HeadFC, Link } from "gatsby";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";

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
            loading="lazy"
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

function FeatureSection() {
  return (
    <div className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-bold">
                Wer samma mia,{" "}
                <span className="text-primary dark:text-primary-400 no-underline">
                  wos damma mia?
                </span>
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Gemeinsam weiter!
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Wir, der Kinderlicht Wallersdorf e. V., sind eine bunte Truppe,
                die bereits seit einigen Jahre durch Veranstaltungen und
                Projekte Spendengelder für sozial benachteiligte (Armut,
                Krankheit, Behinderung, etc.) Kinder und Jugendliche sammelt und
                regional gezielt unterstützt, dort wo Hilfe benötigt wird.
                Unsere Projekte sind dabei so vielfältig wie wir selbst. Dabei
                steht bei uns die Freude an der Zusammenarbeit und der
                Gemeinschaftssinn im Vordergrund, mit dem Ziel zu helfen und zu
                unterstützen!
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="absolute left-1 top-1 h-5 w-5 text-primary bi bi-stars"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
                    </svg>
                    Effektiv.{" "}
                  </dt>
                  <dd className="inline">
                    Der Kinderlicht Wallersdorf e.V. setzt sich
                    leidenschaftlich dafür ein, Kindern und Familien in
                    schwierigen Situationen zu helfen. Dank großzügiger Spenden
                    und kreativer Aktionen können wir effektiv und mit möglichst
                    wenige Bürokratie Unterstützung bieten.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-primary absolute left-1 top-1 h-5 w-5 bi bi-people-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                    Gemeinschaftlich.{" "}
                  </dt>
                  <dd className="inline">
                    Bei uns arbeitet ein engagiertes Team Hand in Hand und schafft
                    Möglichkeiten, Kindern und Familien in Not zu helfen.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-primary absolute left-1 top-1 h-5 w-5 bi bi-brush-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04z" />
                    </svg>
                    Kreativ.{" "}
                  </dt>
                  <dd className="inline">
                    Wir sind bekannt für unsere verrückten Aktionen, die nicht
                    nur Spaß machen, sondern auch viel Gutes bewirken. Dank
                    der großartigen Unterstützung von allen Seiten 
                    können wir kreativ sein und bedürftigen
                    Kindern und Familien Hoffnung und Hilfe schenken.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div>
          <StaticImage
            alt="Unsere Vorstandschaft"
            src="../images/home/all.jpg"
            className="h-full w-full object-cover object-center rounded-3xl"
          />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap container items-center mt-8">
        <StaticImage
          src="../images/home/motto.svg"
          alt="Weil nix wird eh scho z'oft do."
          className="m-auto w-full aspect-[3755/227]"
        />
      </div>
    </div>
  );
}

export default function IndexPage() {
  return (
    <Layout>
      <StaticImage src="../images/home/banner.svg" alt="Kinderlicht Banner" className="my-4" quality={100}/>
      <div>
        <section className="text-gray-600 body-font mt-24">
          <div className="container px-5 mt-16 mx-auto max-w-7x1">
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
          <div className="container px-5 mt-24 mx-auto max-w-7x1">
            <div className="flex flex-wrap w-full mb-4 p-4"></div>
            <FeatureSection></FeatureSection>
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
                link="/wie-alles-begann"
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
                link="/die-gruendung"
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
                link="/schirmherrschaft"
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
                link="/lasershow-premiere-in-wallersdorf"
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
                link="/eine-musikalische-reise-durch-die-welt-der-filmmusik"
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
                link="/einen-beitrag-zum-auto-geleistet"
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
                link="/masken-fuer-ein-kinderlaecheln"
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
                link="/ab-ins-beet"
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

export const Head: HeadFC = () => <title>Kinderlicht</title>;
