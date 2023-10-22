import Image from "next/image";

export default function Home() {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto max-w-7x1">
          <div className="flex flex-wrap w-full mb-4 p-4">
            <div className="w-full mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold">
          Kinderlicht Wallersdorf{" "}
          <u className="text-primary dark:text-primary-400 no-underline">e. V.</u>
        </h2>
              <div className="h-1 w-20 bg-primary rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <a href="/anfrage">
                  <img
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
                    src="/home/help.png"
                    alt="Image Size 720x400"
                  />
                  <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                    Melde dich bei uns, wir helfen gerne!
                  </h3>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                    Ich suche Hilfe!
                  </h2>
                  <p className="leading-relaxed text-base">
                    Der Kinderlicht Wallersdorf e.V. konnte bereits vielen
                    Familien erfolgreich helfen.
                  </p>
                </a>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <a href="/beitreten">
                  <img
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="/home/donate.png"
                    alt="Image Size 720x400"
                  />
                  <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                    Spenden oder Beitreten
                  </h3>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                    Ich möchte helfen!
                  </h2>
                  <p className="leading-relaxed text-base">
                    Für Menschen, die sich engagieren oder uns einfach
                    finanziell unterstützen wollen!
                  </p>
                </a>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <a href="/neues">
                  <img
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="/home/news.png"
                    alt="Image Size 720x400"
                  />
                  <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                    Unsere News
                  </h3>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                    Ankündigungen und Neuigkeiten
                  </h2>
                  <p className="leading-relaxed text-base">
                    Hier kannst du jeden unserer Schritte verfolgen!
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto max-w-7x1">
          <div className="flex flex-wrap w-full mb-4 p-4">
            <div className="w-full mb-6 lg:mb-0">
            <h2 className="text-3xl font-bold">
          Unsere{" "}
          <u className="text-primary dark:text-primary-400 no-underline">Geschichte</u>
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
            <div className="w-1/2">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
                  src="/home/start.jpg"
                  alt="Lichterhaus"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Die Anfänge
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Das Lichterhaus in Wallersdorf
                </h2>
                <p className="leading-relaxed text-base">
                  Schon vor der Grüdung waren viele Mitglieder beim Lichterhaus
                  Wallersdorf aktiv. Dabei wurden Spenden für die Krebshilfe
                  gesammelt.
                </p>
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                  src="/home/founding.jpg"
                  alt="Gründung"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Die Grüdung
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Der Kinderlicht Wallersdorf e.V.
                </h2>
                <p className="leading-relaxed text-base">
                  Sieben engagierte Mitglieder gründen den Verein im Oktober
                  2018.
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2019</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="w-1/3">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
                  src="/home/umbrella.jpg"
                  alt="Schirmherrschaft"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Schirmherrschaft
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Florian Pronold übernimmt die Schirmherrschaft
                </h2>
                <p className="leading-relaxed text-base">
                  Schnell war auch ein prominenter Schirmherr aus dem Bundestag
                  gefunden: Florian Pronold.
                </p>
              </div>
            </div>
            <div className="w-1/3">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <iframe
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                  src="https://www.youtube.com/embed/FjgCtdiizUY?si=fIZhSdl5d-02NIQv&amp;controls=0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Erste Erfolge
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Rennen auf dem Nürburgring
                </h2>
                <p className="leading-relaxed text-base">
                  Innerhalb eines Jahres konnten wir mehreren betroffenen
                  Familien gemeinsam mit der VKKK ein Wochenende auf dem
                  Nürburgring ermöglichen.
                </p>
              </div>
            </div>
            <div className="w-1/3">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                  src="/home/fireworks.jpg"
                  alt="Lasershow"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Lasershow
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Lasershow durch Crowdfunding
                </h2>
                <p className="leading-relaxed text-base">
                  Wenig später gab es schon das nächste - im wahrsten Sinne des
                  Wortes - Highlight: Durch Crowdfunding konnten wir eine
                  umweltschonende Lasershow organisieren.
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2020</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="w-1/2">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
                  src="/home/music.jpg"
                  alt="Konzert der Filmmusik"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Unterhaltung
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Konzert der Filmmusik
                </h2>
                <p className="leading-relaxed text-base">
                  Auch kulturell kann der Kinderlicht Wallersdorf e.V. einiges
                  bieten: noch vor der Pandemie organisiert der Verein ein
                  Konzert der Filmmusik mit 80 MusikerInnen.
                </p>
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
                  src="/home/car.jpg"
                  alt="Spenden"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Hohe Spenden
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Spenden an zwei Familien
                </h2>
                <p className="leading-relaxed text-base">
                  Der Kinderlicht Wallersdorf. e.V. spendet in diesem Jahr
                  insgesamt 4000€ an zwei Familien. Unter anderem wird ein Auto
                  mitfinanziert.
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2021</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
          <div className="w-1/3">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
                  src="/home/corona.jpg"
                  alt="Corona Krise"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Corona Krise
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Kinderlicht in Krisenzeiten
                </h2>
                <p className="leading-relaxed text-base">
                  Auch während der Kirsenzeiten konnten wir einige Spenden sammeln und so weiterhelfen.
                </p>
              </div>
            </div>
            <div className="w-1/3">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <iframe
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                  src="https://www.youtube.com/embed/AkCsF4e41JI?si=ZYmi62akER48yqNr&amp;controls=0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Ferienprogramm
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  3 Tage im Mittelalter
                </h2>
                <p className="leading-relaxed text-base">
                  In unserem zweiten Ferienprogramm, nahmen wir die TeilnehmerInnen auf eine
                  dreitägige Reise durch die Zeit ins Mittelalter mit.
                </p>
              </div>
            </div>
            <div className="w-1/3">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <iframe
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                  src="https://www.youtube.com/embed/bGR75Cy2BrU?si=CN-bjRy-gWQdhQ9Y&amp;controls=0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  #Krippalkalender
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  24 Tage Livestreams
                </h2>
                <p className="leading-relaxed text-base">
                  Für eine großangelegte Spendenaktion haben wir an 24 Tagen in Folge eigens produzierte Inhlate gestreamt. Es konnten 3346€ gesammelt werden.
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">2022</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex flex-wrap -m-4">
          <div className="w-1/2">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
                  src="/home/hochbeet.jpg"
                  alt="Helfen, helfen, helfen!"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Anpacken!
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Mehr Spenden und Renovierungen
                </h2>
                <p className="leading-relaxed text-base">
                  Auch in 2022 konnten wir viele Spenden verteilen und haben neben einer Wohnungsrenovierung auch ein Hochbeet für einen Kindergarten gebaut.
                </p>
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <iframe
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                  src="https://www.youtube.com/embed/ZRj34XeuHCY?si=-6323dPZhhbgEPjS&amp;controls=0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Embedded youtube"
                />
                <h3 className="tracking-widest text-primary text-xs font-medium title-font">
                  Kinofilm
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Die vier Jahreszeiten
                </h2>
                <p className="leading-relaxed text-base">
                  Auch unsere FilmemacherInnen haben nicht geschlafen und einen Kinofilm produziert. Kann der Weihnachtswichtel die &quot;4 Jahreszeiten&quot; von der bösen Hexe befreien?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}