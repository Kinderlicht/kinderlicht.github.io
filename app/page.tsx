import Image from "next/image";

export default function Home() {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto max-w-7x1">
          <div className="flex flex-wrap w-full mb-4 p-4">
            <div className="w-full mb-6 lg:mb-0">
              <h1 className="sm:text-4xl text-5xl font-bold title-font mb-2 text-gray-900">
                Kinderlicht Wallersdorf e.V.
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
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
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                    Melde dich bei uns, wir helfen gerne!
                  </h3>
                  <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                    Ich suche Hilfe!
                  </h2>
                  <p className="leading-relaxed text-base">
                    Der Kinderlicht Wallersdorf e.V. konnte bereits vielen
                    Familien erfolgreich helfen.{" "}
                  </p>
                </a>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <a href="/helfen">
                  <img
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="/home/donate.png"
                    alt="Image Size 720x400"
                  />
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
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
                <a href="/news">
                  <img
                    className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                    src="/home/news.png"
                    alt="Image Size 720x400"
                  />
                  <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
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
              <h1 className="sm:text-4xl text-5xl font-bold title-font mb-2 text-gray-900">
                Unsere Geschichte
              </h1>
              <div className="h-1 w-20 bg-indigo-500 rounded"></div>
            </div>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="w-full">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72  rounded w-full object-cover object-center mb-6"
                  src="/home/start.jpg"
                  alt="Lichterhaus"
                />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
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
            <div className="w-full">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                  src="/home/founding.jpg"
                  alt="Gründung"
                />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                  Die Grüdung
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Der Kinderlicht Wallersdorf e.V.
                </h2>
                <p className="leading-relaxed text-base">
                  Sieben engagierte Mitglieder gründen den Verein.
                </p>
              </div>
            </div>
            <div className="w-full">
              <div className="bg-white p-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                <img
                  className="lg:h-60 xl:h-56 md:h-64 sm:h-72 xs:h-72 h-72 rounded w-full object-cover object-center mb-6"
                  src="/home/umbrella.jpg"
                  alt="Schirmherrschaft"
                />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                  Schirmherrschaft
                </h3>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                  Florian Pronold übernimmt die Schirmherrschaft
                </h2>
                <p className="leading-relaxed text-base">
                  Schnell war auch ein Schirmherr gefuden: Florian Pronold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
