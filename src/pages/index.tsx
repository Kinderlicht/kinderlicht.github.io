import * as React from "react";
import { HeadFC, Link } from "gatsby";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";
import { PageSectionHeader } from "../components/page";
import * as styles from "../styles/home.module.css";

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

type ActionIconName = "help" | "heart" | "news";

function ActionIcon({ name }: { name: ActionIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "help" && (
        <>
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5a8.5 8.5 0 0 1 17 0Z" />
          <path d="M8 11h8M8 15h5" />
        </>
      )}
      {name === "heart" && (
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      )}
      {name === "news" && (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h10M7 12h4M7 16h4M15 12h2v4h-2z" />
        </>
      )}
    </svg>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

const actions: {
  icon: ActionIconName;
  title: string;
  description: string;
  label: string;
  to: string;
}[] = [
  {
    icon: "help",
    title: "Ich suche Hilfe.",
    description:
      "Manchmal braucht es Unterstützung. Erzähl uns, was dich und deine Familie bewegt – wir helfen gerne.",
    label: "Kontakt aufnehmen",
    to: "/anfrage",
  },
  {
    icon: "heart",
    title: "Ich möchte helfen.",
    description:
      "Mit einer Spende, als Mitglied oder mit deiner Zeit: Gemeinsam können wir junge Menschen und ihre Familien unterstützen.",
    label: "Teil von Kinderlicht werden",
    to: "/beitreten",
  },
  {
    icon: "news",
    title: "Was gibt’s Neues?",
    description:
      "Kleine Lichtblicke und große gemeinsame Momente. Entdecke unsere Aktionen, Projekte und Geschichten.",
    label: "Neuigkeiten entdecken",
    to: "/neues",
  },
];

function FeatureSection() {
  return (
    <section className={styles.about} aria-labelledby="about-title">
      <div>
        <p className="site-eyebrow">Wer samma mia, wos damma mia?</p>
        <h2 id="about-title" className={styles.sectionTitle}>
          Viele Ideen.
          <br />
          Ein gemeinsames Herz.
        </h2>
        <p className={styles.aboutCopy}>
          Wir sind Kinderlicht Wallersdorf e. V. – eine bunte Truppe, die seit
          2018 gemeinsam anpackt. Mit Veranstaltungen und Projekten sammeln wir
          Spenden für Kinder, Jugendliche und junge Erwachsene, die von Armut,
          Krankheit oder Behinderung betroffen sind. Wir helfen vor allem in
          unserer Region, dort, wo Unterstützung gebraucht wird.
        </p>
        <Link to="/wir" className={styles.textLink}>
          Lerne uns kennen <Arrow />
        </Link>
      </div>
      <dl className={styles.values}>
        <div>
          <dt>
            <span aria-hidden="true">01</span> Direkt helfen.
          </dt>
          <dd>
            Schnell und unbürokratisch unterstützen wir junge Menschen und ihre
            Familien in schwierigen Situationen.
          </dd>
        </div>
        <div>
          <dt>
            <span aria-hidden="true">02</span> Gemeinsam anpacken.
          </dt>
          <dd>
            Wir bringen Menschen zusammen und arbeiten eng mit sozialen
            Einrichtungen vor Ort. Miteinander erreichen wir mehr.
          </dd>
        </div>
        <div>
          <dt>
            <span aria-hidden="true">03</span> Mit Freude etwas bewegen.
          </dt>
          <dd>
            Ob Konzert, Kino, Lasershow oder Weihnachtsstand: Unsere Ideen sind
            vielfältig. Die Freude am Helfen verbindet uns.
          </dd>
        </div>
      </dl>
      <div className={styles.motto}>
        <span className={styles.mottoMark} aria-hidden="true">
          ✳
        </span>
        <p>Weil nix wird eh scho z’oft do.</p>
        <span className={styles.mottoCaption}>Unser Antrieb. Seit 2018.</span>
      </div>
    </section>
  );
}

export default function IndexPage() {
  return (
    <Layout>
      <div className={styles.home}>
        <section className={styles.welcome} aria-labelledby="home-title">
          <div className={styles.container}>
            <header className={styles.hero}>
              <p className="site-eyebrow">Kinderlicht Wallersdorf e. V.</p>
              <h1 id="home-title" className={styles.title}>
                Hilfe für junge Menschen
                <br />
                <span>und ihre Familien.</span>
              </h1>
              <p className={styles.lead}>
                Wir unterstützen Kinder, Jugendliche und junge Erwachsene bis
                einschließlich 27 Jahre sowie ihre Familien in schwierigen
                Lebenssituationen.
              </p>
              <a href="#mitmachen" className={styles.heroLink}>
                Hilfe finden oder mitmachen <span aria-hidden="true">↓</span>
              </a>
            </header>
            <nav
              id="mitmachen"
              className={styles.actions}
              aria-label="Hilfe, Mitmachen und Neuigkeiten"
            >
              {actions.map((action) => (
                <Link key={action.to} to={action.to} className={styles.action}>
                  <span className={styles.actionIcon}>
                    <ActionIcon name={action.icon} />
                  </span>
                  <h2>{action.title}</h2>
                  <p>{action.description}</p>
                  <span className={styles.actionLabel}>
                    {action.label}
                    <Arrow />
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
        <div className={styles.container}>
          <FeatureSection />
        </div>
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
  <>
    <title>Kinderlicht Wallersdorf e.V. | Gemeinsam helfen</title>
    <meta
      name="description"
      content="Kinderlicht Wallersdorf e. V. unterstützt Kinder, Jugendliche und junge Erwachsene bis einschließlich 27 Jahre sowie ihre Familien in schwierigen Lebenssituationen."
    />
  </>
);
