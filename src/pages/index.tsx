import * as React from "react";
import { HeadFC, Link } from "gatsby";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";
import { PageSectionHeader } from "../components/page";

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
  const width = size === 1 ? "md:w-full" : size === 2 ? "md:w-1/2" : "md:w-1/3";
  const card = (
    <div
      className={`site-card h-full p-5 ${
        typeof visual === "string" ? "" : "site-card-interactive"
      }`}
    >
      {typeof visual === "string" ? (
        <iframe
          loading="lazy"
          className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
          src={visual}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`Video: ${title}`}
        />
      ) : (
        <>{visual}</>
      )}
      <p className="title-font text-xs font-bold tracking-widest text-orange-700">
        {short}
      </p>
      <h3 className="title-font mb-4 text-lg font-medium text-gray-900">
        {title}
      </h3>
      <p className="leading-relaxed text-base">{description}</p>
    </div>
  );

  if (typeof visual === "string") {
    return <article className={`w-full p-3 ${width}`}>{card}</article>;
  }

  const linkClasses = `block w-full p-3 ${width}`;
  return link.startsWith("http") ? (
    <a href={link} aria-label={title} className={linkClasses}>
      {card}
    </a>
  ) : (
    <Link to={link} aria-label={title} className={linkClasses}>
      {card}
    </Link>
  );
}

function FeatureSection() {
  return (
    <div className="overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-bold">
                Wer samma mia,{" "}
                <span className="text-orange-700 dark:text-orange-400 no-underline">
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
                      aria-hidden="true"
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
                    Der Kinderlicht Wallersdorf e.V. setzt sich leidenschaftlich
                    dafür ein, Kindern und Familien in schwierigen Situationen
                    zu helfen. Unser Ziel ist es, unbürokratisch und schnell zu
                    helfen.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <svg
                      aria-hidden="true"
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
                    Bei uns arbeitet ein engagiertes und diverses Team Hand in
                    Hand. Wir unterstützen überwiegend regional und direkt dort,
                    wo Hilfe benötigt wird. Dabei arbeiten wir unter anderem eng
                    mit lokalen sozialen Einrichtungen und Institutionen
                    zusammen. Innerhalb von 5 Jahren konnten wir so bereits über
                    55.000€ spenden.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <svg
                      aria-hidden="true"
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
                    nur Spaß machen, sondern auch viel Gutes bewirken. Ob ein
                    Konzert, ein Kinofilm, eine Lasershow, Bälle, oder ein
                    Weihnachtsstand - bei uns ist immer was los!
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div>
            <StaticImage
              alt="Unsere Vorstandschaft"
              src="../images/home/all.jpg"
              className="h-full w-full rounded-2xl object-cover object-center"
            />
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center">
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
      <StaticImage
        src="../images/home/banner.svg"
        alt=""
        className="my-4"
        quality={100}
      />
      <h1 className="sr-only">Kinderlicht Wallersdorf e.V.</h1>
      <div>
        <section className="site-page pb-0 pt-12 text-slate-600">
          <h2 className="sr-only">
            Direkt zu Hilfe, Mitgliedschaft und Neuigkeiten
          </h2>
          <div>
            <div className="-m-3 flex flex-wrap">
              <HistoryLink
                title="Ich suche Hilfe!"
                description="Der Kinderlicht Wallersdorf e.V. konnte bereits vielen Familien erfolgreich helfen."
                short="Melde dich bei uns, wir helfen gerne!"
                link="/anfrage"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src={"../images/home/help.png"}
                    alt=""
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
                    alt=""
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
                    alt=""
                  />
                }
                size={3}
              />
            </div>
          </div>
        </section>
        <section className="site-page pb-0 pt-20 text-slate-600">
          <div>
            <FeatureSection></FeatureSection>
          </div>
        </section>
        <section className="site-page pt-20 text-slate-600">
          <div>
            <PageSectionHeader
              eyebrow="Seit 2018"
              title="Unsere Geschichte"
              description="Aktionen, Projekte und Momente, die Kinderlicht geprägt haben."
            />
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 flex-shrink rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
                2025
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>
            <div className="flex flex-wrap -m-4">
              <HistoryLink
                title="Schneeball 2025"
                description="Im Jahr 2025 stand der Schneeball im Zeichen dreier Kinder aus Wallersdorf. Die Anteilnahme war überwältigend."
                short="Schneeball 2025"
                link="/2025-12-27_schneeball-wallersdorf"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/news/2025-12-27_schneeball-wallersdorf.jpeg"
                    alt=""
                  />
                }
                size={3}
              />
              <HistoryLink
                title="Europapark Ausflug"
                description="Wir haben 15 Kinder in den Europapark eingeladen, um ihnen zwei unvergessliche Tage zu bereiten."
                short="Adrenalin pur"
                link="/2025-06-20_europapark"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/news/2025-06-20_europapark.png"
                    alt=""
                  />
                }
                size={3}
              />
              <HistoryLink
                title="Erster Flosar"
                description="Zusammen mit Kolping konnten wir mit dem ersten Flosar (Flohmarkt + Basar) eine neue Spendenaktion ins Leben rufen. Der Erfolg war überwältigend!"
                short="Nachhaltig helfen"
                link="/2025-10-18_erster-flosar-in-wallersdorf-ein-voller-erfolg/"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/news/2025-10-18_erster-flosar-in-wallersdorf-ein-voller-erfolg.jpg"
                    alt=""
                  />
                }
                size={3}
              />
            </div>
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 flex-shrink rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
                2024
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>
            <div className="flex flex-wrap -m-4">
              <HistoryLink
                title="Konzert der Filmmusik - Teil 2"
                description="Nach dem großen Erfolg im Jahr 2020, haben wir 2024 das Konzert der Filmmusik wiederholt. Es war ein voller Erfolg!"
                short="Eine Sprache, die jeder versteht"
                link="/ein-abend-voller-musik-fuer-den-guten-zweck"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/kdf2.jpg"
                    alt=""
                  />
                }
                size={2}
              />
              <HistoryLink
                title="Don't Stand Alone"
                description="In Zusammenarbeit mit der Frauenliste und anderen Vereinen aus Wallersdorf, wurden täglich Getränke und Köstlichkeiten zur Vorweihnachtszeit ausgegeben. Das gesammelte Geld kam den jeweiligen Vereinen zu Gute."
                short="Gemeinsam stark"
                link="/ein-unvergesslicher-weihnachtsstand-in-wallersdorf"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/weihnachtsstand.png"
                    alt=""
                  />
                }
                size={2}
              />
            </div>
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 flex-shrink rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
                2023
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>
            <div className="flex flex-wrap -m-4">
              <HistoryLink
                title="DKMS Registrierungsaktion"
                description="In Zusammenarbeit mit der DKMS konnten wir eine Registrierungsaktion durchführen und so potentielle Stammzellenspender*innen finden."
                short="Stammzellenspende"
                link="https://www.facebook.com/KinderlichtWallersdorf/posts/pfbid02dq3FW8QqHRviX7G4XhAZ7UhXXVPw6QWTgeR9ysvVGrf1TYADqyh1dSoVoJqzjZu2l"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/stammzellenspende.jpg"
                    alt=""
                  />
                }
                size={3}
              />
              <HistoryLink
                title="Kinderlicht wird 5 Jahre alt"
                description="Der Kinderlicht Wallersdorf e.V. feiert sein 5-jähriges Bestehen. Wir blicken zurück auf viele erfolgreiche Projekte und freuen uns auf die Zukunft."
                short="Grillfest zum Jubiläum"
                link="https://www.facebook.com/KinderlichtWallersdorf/posts/pfbid02Y28G7fR1RaDGs9SDZQdZDDmWyTQKxqnxWKok6B4NCnK1bVSFnemQ34mL8SNmAnzml"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/news/jubilaeum-2023.jpg"
                    alt=""
                  />
                }
                size={3}
              />
              <HistoryLink
                title="Schneeball mit Kolping"
                description="Der Schneeball 2023 ist das Markenzeichen des Kinderlicht Wallersdorf e.V. und konnte in Zusammenarbeit mit Kolping und mit über 110 Gästen wieder seinen Charme entfalten."
                short="Kolping und Kinderlicht begeistern"
                link="/schneeball-2023"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/news/schneeball-2023.jpg"
                    alt=""
                  />
                }
                size={3}
              />
            </div>
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 flex-shrink rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
                2022
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
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
                    alt=""
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
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 flex-shrink rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
                2021
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
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
                    alt=""
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
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 flex-shrink rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
                2020
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
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
                    alt=""
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
                    alt=""
                  />
                }
                size={2}
              />
            </div>
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 flex-shrink rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
                2019
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
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
                    alt=""
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
                    alt=""
                  />
                }
                size={3}
              />
            </div>
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="mx-4 flex-shrink rounded-full border border-slate-200 bg-white px-4 py-1 text-sm font-bold text-slate-700 shadow-sm">
                2018
              </span>
              <div className="flex-grow border-t border-slate-300"></div>
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
                    alt=""
                  />
                }
                size={2}
              />
              <HistoryLink
                title="Der Kinderlicht Wallersdorf e.V."
                description="Sieben engagierte Mitglieder gründen den Verein im Oktober 2018."
                short="Die Gründung"
                link="/wie-alles-begann"
                visual={
                  <StaticImage
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="../images/home/founding.jpg"
                    alt=""
                  />
                }
                size={2}
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const Head: HeadFC = () => (
  <title>Kinderlicht Wallersdorf e.V. | Gemeinsam helfen</title>
);
